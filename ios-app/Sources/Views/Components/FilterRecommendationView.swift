import SwiftUI

struct FilterRecommendationView: View {
    let contaminants: [Contaminant]
    
    // Simple logic to determine recommendation (Ported from web)
    var recommendation: (title: String, desc: String) {
        if contaminants.contains(where: { $0.name == "PFAS" || $0.name == "PFOA" }) {
            return ("Reverse Osmosis System", "The gold standard for removing PFAS and other persistent chemicals.")
        } else if contaminants.contains(where: { $0.name == "Bacteria" }) {
            return ("UV Filter System", "Essential for killing bacteria and viruses.")
        } else if contaminants.contains(where: { $0.name == "Lead" }) {
            return ("Certified Lead Pitcher", "Specifically certified to remove lead.")
        } else {
            return ("Activated Carbon Pitcher", "Great for improving taste and odor.")
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recommended Solution")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.blue)
                    .clipShape(Capsule())
                Spacer()
            }
            
            Text(recommendation.title)
                .font(.title3)
                .fontWeight(.bold)
            
            Text(recommendation.desc)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            // Placeholder Image
            Rectangle()
                .fill(Color.gray.opacity(0.1))
                .frame(height: 150)
                .cornerRadius(12)
                .overlay(
                    Image(systemName: "drop.fill")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 40)
                        .foregroundColor(.blue.opacity(0.3))
                )
            
            Button(action: {
                // Open Affiliate Link
            }) {
                Text("Check Price & Availability")
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(colors: [.blue, .teal], startPoint: .leading, endPoint: .trailing)
                    )
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
        }
        .padding(20)
        .background(.ultraThinMaterial)
        .cornerRadius(24)
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }
}
