package agent

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

type Config struct {
	NodeID      string `json:"nodeId"`
	AssignedTier string `json:"assignedTier"`
}

type Worker struct {
	apiURL  string
	p2pPort int
	config  Config
	client  *http.Client
}

func NewWorker(apiURL string, p2pPort int) (*Worker, error) {
	w := &Worker{
		apiURL:  apiURL,
		p2pPort: p2pPort,
		client:  &http.Client{Timeout: 10 * time.Second},
	}
	_ = w.loadConfig()
	return w, nil
}

func IsRegistered() bool {
	_, err := os.Stat(configPath())
	return err == nil
}

func configPath() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".nodl", "node.json")
}

func (w *Worker) loadConfig() error {
	data, err := os.ReadFile(configPath())
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &w.config)
}

func (w *Worker) saveConfig() error {
	path := configPath()
	_ = os.MkdirAll(filepath.Dir(path), 0755)
	data, _ := json.MarshalIndent(w.config, "", "  ")
	return os.WriteFile(path, data, 0644)
}

func (w *Worker) Register(ctx context.Context, token string) error {
	hw, err := GetHardwareInfo()
	if err != nil {
		return err
	}

	payload := map[string]interface{}{
		"registration_token": token,
		"os":                 hw.OS,
		"arch":               hw.Arch,
		"cpu_cores":          hw.CPUCores,
		"memory_gb":          hw.MemoryGB,
		"gpu_present":        hw.GPUPresent,
		"gpu_model":          hw.GPUModel,
		"version":            "nodlr-agent-0.1.0",
		"p2p_port":           w.p2pPort,
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequestWithContext(ctx, "POST", w.apiURL+"/api/nodes/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", applicationJson)

	resp, err := w.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("server error (%d): %s", resp.StatusCode, string(b))
	}

	var result struct {
		NodeID       string `json:"node_id"`
		AssignedTier string `json:"assigned_tier"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return err
	}

	w.config.NodeID = result.NodeID
	w.config.AssignedTier = result.AssignedTier
	return w.saveConfig()
}

func (w *Worker) Start(ctx context.Context) error {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	// Immediate first heartbeat
	w.sendHeartbeat(ctx)

	for {
		select {
		case <-ctx.Done():
			return nil
		case <-ticker.C:
			w.sendHeartbeat(ctx)
		}
	}
}

const applicationJson = "application/json"

func (w *Worker) sendHeartbeat(ctx context.Context) {
	stats, err := GetStats(ctx)
	if err != nil {
		fmt.Printf("Error getting stats: %v\n", err)
		return
	}

	payload := map[string]interface{}{
		"node_id":        w.config.NodeID,
		"cpu_load":       stats.CPULoad,
		"memory_used_gb": stats.MemoryUsed,
		"gpu_load":       stats.GPULoad,
		"version":        "nodlr-agent-0.1.0",
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequestWithContext(ctx, "POST", w.apiURL+"/api/nodes/heartbeat", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", applicationJson)

	resp, err := w.client.Do(req)
	if err != nil {
		fmt.Printf("Heartbeat failed: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Heartbeat rejected: %d\n", resp.StatusCode)
	}
}
