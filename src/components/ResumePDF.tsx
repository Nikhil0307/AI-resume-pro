import { Page, Text, View, Document, StyleSheet} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  
   page: { padding: 35, fontSize: 10.5, fontFamily: "Helvetica" },

  // Header
  header: { fontSize: 20, textAlign: "center", fontWeight: "bold", marginBottom: 4 },
  contact: { fontSize: 8, textAlign: "center", marginBottom: 14, color: "#444" },

  // Section titles with underline
  sectionTitle: {
    fontSize: 8.5,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },

  // Body text
  bodyText: { fontSize: 8, lineHeight: 1.4, marginBottom: 4 },

  // Bullet points
  bulletPoint: { marginLeft: 8, marginBottom: 2, fontSize: 8.5 },

  // Projects block
  project: { marginBottom: 6 },
  // Project description block
  projectDescription: { fontSize: 8, lineHeight: 1.4, marginBottom: 4, fontStyle: "italic" },

  // Role / company line
  roleLine: { fontWeight: "bold", fontSize: 8 },
  dateLine: { fontSize: 7, marginBottom: 2, color: "#555" },
});

export const ResumePDF = ({ resume, userProfile }: { resume: any; userProfile: any }) => {
  if (!resume) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.header}>{userProfile.personalInfo.name}</Text>
          <Text style={styles.contact}>
            {userProfile.personalInfo.email} | {userProfile.personalInfo.phone}
          </Text>
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            ⚠️ This provider is locked. Please use Gemini for full resume export.
          </Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>{userProfile.personalInfo.name}</Text>
        <Text style={styles.contact}>
          {userProfile.personalInfo.phone} | {userProfile.personalInfo.email}
          {userProfile.personalInfo.website && ` | ${userProfile.personalInfo.website}`}
          {userProfile.personalInfo.github && ` | ${userProfile.personalInfo.github}`}
          {userProfile.personalInfo.linkedin && ` | ${userProfile.personalInfo.linkedin}`}
        </Text>

        {/* Summary */}
        {resume.summary && (
          <>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.bodyText}>{resume.summary}</Text>
          </>
        )}

        {/* Skills */}
        {resume.skills && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(resume.skills).map(([cat, list]: [string, any], i) => (
              <Text key={i} style={styles.bodyText}>
                <Text style={{ fontWeight: "bold" }}>{cat}: </Text>
                {list.join(", ")}
              </Text>
            ))}
          </>
        )}

        {/* Experience */}
        {resume.work_experience && (
          <>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {resume.work_experience.map((exp: any, i: number) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.roleLine}>
                  {exp.title} — {exp.company} ({exp.location})
                </Text>
                <Text style={styles.dateLine}>
                  {exp.startDate} - {exp.endDate}
                </Text>
                {exp.achievements.map((a: string, j: number) => (
                  <Text key={j} style={styles.bulletPoint}>
                    • {a}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Projects */}
        {resume.projects && (
          <>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.slice(0, 2).map((proj: any, i: number) => (
              <View key={i} style={styles.project}>
                <Text style={styles.roleLine}>{proj.name}</Text>
                <Text style={styles.projectDescription}>{proj.description}</Text>
                {proj.achievements.map((a: string, j: number) => (
                  <Text key={j} style={styles.bulletPoint}>
                    • {a}
                  </Text>
                ))}
                {proj.technologies?.length > 0 && (
                  <Text style={styles.bodyText}>
                    <Text style={{ fontWeight: "bold" }}>Tech: </Text>
                    {proj.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Education */}
        {resume.education && (
          <>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu: any, i: number) => (
              <Text key={i} style={styles.bodyText}>
                • {edu.degree}, {edu.institution} ({edu.graduationDate})
              </Text>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};
