package api

import (
	"strings"

	"github.com/obregan/nodl/nodld/internal/pricing"
)

// AssignTier determines the compute tier based on hardware specs.
func AssignTier(cpuCores int, memoryGB int, gpuModel string) string {
    gpu := strings.ToLower(gpuModel)

	if strings.Contains(gpu, "h100") {
		if strings.Contains(gpu, "8x") {
			return string(pricing.TierGPUMax)
		}
		return string(pricing.TierGPUPro)
	}

	if strings.Contains(gpu, "confidential") || strings.Contains(gpu, "tee") {
		return string(pricing.TierDecc)
	}

	if strings.Contains(gpu, "4090") {
		if cpuCores >= 64 {
			return string(pricing.TierUltra)
		}
		return string(pricing.TierBoost)
	}

	if cpuCores >= 16 && memoryGB >= 32 {
		return string(pricing.TierStandard)
	}

	return string(pricing.TierStandard) // Default to standard
}
