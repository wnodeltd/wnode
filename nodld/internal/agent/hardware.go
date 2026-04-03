package agent

import (
	"context"
	"fmt"
	"os/exec"
	"runtime"
	"strings"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/host"
	"github.com/shirou/gopsutil/v3/mem"
)

// HardwareInfo collects system metadata.
type HardwareInfo struct {
	OS          string  `json:"os"`
	Arch        string  `json:"arch"`
	CPUCores    int     `json:"cpu_cores"`
	MemoryGB    int     `json:"memory_gb"`
	GPUPresent  bool    `json:"gpu_present"`
	GPUModel    string  `json:"gpu_model"`
	GPUVRAM     int     `json:"gpu_vram_gb"`
	Hostname    string  `json:"hostname"`
}

// Stats reports real-time system load.
type Stats struct {
	CPULoad    float64 `json:"cpu_load"`
	MemoryUsed float64 `json:"memory_used_gb"`
	GPULoad    float64 `json:"gpu_load"`
}

func GetHardwareInfo() (*HardwareInfo, error) {
	h, _ := host.Info()
	c, _ := cpu.Counts(true)
	v, _ := mem.VirtualMemory()

	info := &HardwareInfo{
		OS:       runtime.GOOS,
		Arch:     runtime.GOARCH,
		CPUCores: c,
		MemoryGB: int(v.Total / 1024 / 1024 / 1024),
		Hostname: h.Hostname,
	}

	// Detect GPU
	detectGPU(info)

	return info, nil
}

func detectGPU(info *HardwareInfo) {
	// Nvidia detection via nvidia-smi
	out, err := exec.Command("nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader,nounits").Output()
	if err == nil {
		lines := strings.Split(strings.TrimSpace(string(out)), "\n")
		if len(lines) > 0 {
			parts := strings.Split(lines[0], ",")
			if len(parts) >= 2 {
				info.GPUPresent = true
				info.GPUModel = strings.TrimSpace(parts[0])
				fmt.Sscanf(parts[1], "%d", &info.GPUVRAM)
				info.GPUVRAM = info.GPUVRAM / 1024
				return
			}
		}
	}

	// Fallback/Generic (could add AMD/Intel detection here)
}

func GetStats(ctx context.Context) (*Stats, error) {
	v, _ := mem.VirtualMemory()
	c, _ := cpu.PercentWithContext(ctx, 0, false)

	s := &Stats{
		MemoryUsed: float64(v.Used) / 1024 / 1024 / 1024,
	}
	if len(c) > 0 {
		s.CPULoad = c[0] / 100.0
	}

	return s, nil
}
