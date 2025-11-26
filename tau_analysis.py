#!/usr/bin/env python3
"""
Tau Calibration Visualization for Verbalized Sampling
Shows how different tau values affect diversity vs quality trade-offs
"""

import matplotlib.pyplot as plt
import numpy as np

def simulate_tau_effects():
    """Simulate how different tau values affect outcomes"""
    
    # Simulated data based on research patterns
    tau_values = [0.01, 0.03, 0.05, 0.08, 0.10, 0.12, 0.15]
    
    # Diversity increases as tau decreases (more restrictive = more diverse)
    diversity_scores = [0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35]
    
    # Quality decreases as tau decreases (fewer good options)
    quality_scores = [0.70, 0.78, 0.85, 0.90, 0.92, 0.93, 0.94]
    
    # Composite score (weighted optimization)
    composite_scores = [d * 0.7 + q * 0.3 for d, q in zip(diversity_scores, quality_scores)]
    
    return tau_values, diversity_scores, quality_scores, composite_scores

def plot_tau_analysis():
    """Create visualization of tau effects"""
    
    tau_values, diversity, quality, composite = simulate_tau_effects()
    
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))
    
    # Diversity vs Tau
    ax1.plot(tau_values, diversity, 'bo-', linewidth=2, markersize=8)
    ax1.set_xlabel('Tau (τ) Threshold')
    ax1.set_ylabel('Diversity Score')
    ax1.set_title('Diversity vs Tau')
    ax1.grid(True, alpha=0.3)
    ax1.invert_xaxis()  # Lower tau = higher diversity
    
    # Quality vs Tau  
    ax2.plot(tau_values, quality, 'ro-', linewidth=2, markersize=8)
    ax2.set_xlabel('Tau (τ) Threshold')
    ax2.set_ylabel('Quality Score')
    ax2.set_title('Quality vs Tau')
    ax2.grid(True, alpha=0.3)
    
    # Composite Score vs Tau
    ax3.plot(tau_values, composite, 'go-', linewidth=2, markersize=8)
    optimal_tau = tau_values[np.argmax(composite)]
    optimal_score = max(composite)
    ax3.plot(optimal_tau, optimal_score, 'g*', markersize=15, label=f'Optimal τ={optimal_tau}')
    ax3.set_xlabel('Tau (τ) Threshold')
    ax3.set_ylabel('Composite Score')
    ax3.set_title('Optimization Target')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('/Users/johnferguson/Github/verbalized-sampling-mcp/tau_analysis.png', dpi=150, bbox_inches='tight')
    plt.show()

def model_specific_tau_rationale():
    """Explain why different models need different tau values"""
    
    models = {
        'Claude Sonnet 4.5': {
            'tau': 0.08,
            'reasoning': 'Conservative probability estimation, needs moderate filtering',
            'capability': 'High but cautious'
        },
        'GPT-5': {
            'tau': 0.05, 
            'reasoning': 'Very capable, can find quality in low-probability tails',
            'capability': 'Very high'
        },
        'Gemini 2.5 Pro': {
            'tau': 0.10,
            'reasoning': 'Less calibrated probability estimates, needs higher threshold',
            'capability': 'High but less calibrated'
        },
        'Llama 3.3': {
            'tau': 0.15,
            'reasoning': 'Open source models less calibrated, need more permissive threshold',
            'capability': 'Medium'
        }
    }
    
    print("🧠 Model-Specific Tau Rationale:")
    print("=" * 50)
    for model, config in models.items():
        print(f"\n📱 {model}")
        print(f"   τ (tau): {config['tau']}")
        print(f"   Reasoning: {config['reasoning']}")
        print(f"   Capability: {config['capability']}")

if __name__ == "__main__":
    print("🎯 Verbalized Sampling Tau (τ) Analysis")
    print("=" * 50)
    
    # Show model-specific rationale
    model_specific_tau_rationale()
    
    # Generate visualization
    print("\n📊 Generating tau optimization visualization...")
    plot_tau_analysis()
    
    print(f"\n✅ Visualization saved to: tau_analysis.png")
    print("\n🔬 Key Insights:")
    print("   • Lower tau = higher diversity, lower quality")
    print("   • Higher tau = lower diversity, higher quality") 
    print("   • Optimal tau balances diversity vs quality")
    print("   • Model capability determines optimal tau range")