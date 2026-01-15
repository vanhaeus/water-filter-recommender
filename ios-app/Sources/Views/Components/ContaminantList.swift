import SwiftUI
import Charts

struct ContaminantList: View {
    let contaminants: [Contaminant]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Contaminants Detected")
                .font(.headline)
                .foregroundColor(.red)
                .textCase(.uppercase)
                .padding(.bottom, 4)
            
            if contaminants.isEmpty {
                HStack {
                    Image(systemName: "checkmark.shield.fill")
                        .foregroundColor(.green)
                    Text("No major contaminants detected.")
                        .foregroundColor(.secondary)
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.green.opacity(0.1))
                .cornerRadius(12)
            } else {
                ForEach(contaminants) { contaminant in
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.red)
                                .padding(8)
                                .background(Color.red.opacity(0.1))
                                .clipShape(Circle())
                            
                            VStack(alignment: .leading) {
                                Text(contaminant.name)
                                    .font(.headline)
                                Text(contaminant.description ?? "Potential health risk")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            Text(contaminant.formattedLevel)
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.red.opacity(0.1))
                                .foregroundColor(.red)
                                .cornerRadius(8)
                        }
                        .accessibilityElement(children: .combine)
                        .accessibilityLabel("\(contaminant.name). Level: \(contaminant.formattedLevel). \(contaminant.description ?? "")")
                        
                        // Simple Bar Chart for Visualization
                        if let level = contaminant.level, let limit = contaminant.safetyLimit {
                            Chart {
                                BarMark(
                                    x: .value("Level", level),
                                    stacking: .standard
                                )
                                .foregroundStyle(.red)
                                .annotation(position: .overlay) {
                                    Text("Detected")
                                        .font(.caption2)
                                        .foregroundColor(.white)
                                }
                                
                                RuleMark(x: .value("Limit", limit))
                                    .foregroundStyle(.gray)
                                    .lineStyle(StrokeStyle(lineWidth: 2, dash: [5]))
                                    .annotation(position: .top) {
                                        Text("Limit: \(limit, specifier: "%.3f")")
                                            .font(.caption2)
                                            .foregroundColor(.gray)
                                    }
                            }
                            .frame(height: 40)
                            .chartXAxis(.hidden)
                        }
                    }
                    .padding()
                    .background(Color.white)
                    .cornerRadius(16)
                    .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                }
            }
        }
        .padding(20)
        .background(Color.red.opacity(0.05))
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.red.opacity(0.1), lineWidth: 1)
        )
    }
}
