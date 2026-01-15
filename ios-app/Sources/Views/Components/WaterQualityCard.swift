import SwiftUI

struct WaterQualityCard: View {
    let report: WaterQualityReport
    let gradeColor: Color
    
    var body: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Water Quality")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Text("\(report.city), \(report.state)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("HARDNESS")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(.blue)
                    
                    Text(report.hardness)
                        .font(.title3)
                        .fontWeight(.semibold)
                }
                .padding(12)
                .background(Color.blue.opacity(0.1))
                .cornerRadius(12)
            }
            
            Spacer()
            
            // Grade Circle
            ZStack {
                Circle()
                    .stroke(gradeColor, lineWidth: 4)
                    .frame(width: 80, height: 80)
                
                Text(report.grade)
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .foregroundColor(gradeColor)
            }
            .accessibilityLabel("Water Quality Grade: \(report.grade)")
        }
        .padding(20)
        .background(.ultraThinMaterial)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }
}
