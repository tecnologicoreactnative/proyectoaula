import React from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView } from "react-native";

const TermsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          TÉRMINOS Y CONDICIONES DE USO DE XHEALTH
        </Text>
        <Text style={styles.effectiveDate}>
          Fecha de entrada en vigor: 21/04/2025
        </Text>

        <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
        <Text style={styles.text}>
          Al utilizar la aplicación XHealth (disponible en tiendas de
          aplicaciones), aceptas cumplir estos términos. Si no estás de acuerdo,
          abstente de usar la aplicación.
        </Text>
        <Text style={styles.text}>
          Propietario:{" "}
          <Text style={styles.highlight}>HealthTech Solutions S.A.S.</Text>,
          sociedad legalmente constituida en Colombia, con NIT{" "}
          <Text style={styles.highlight}>901.234.567-8</Text> y domicilio en{" "}
          <Text style={styles.highlight}>CL 78B #72 A-220, Medellin</Text>.
        </Text>
        <Text style={styles.text}>
          XHealth se reserva el derecho de modificar estos términos. El uso
          continuado tras cambios implica aceptación.
        </Text>

        <Text style={styles.sectionTitle}>2. Conducta del Usuario</Text>
        <Text style={styles.subtitle}>Prohibiciones:</Text>
        <Text style={styles.text}>
          • Publicar contenido ilegal, difamatorio, discriminatorio (por raza,
          género, religión, etc.), o que viole derechos de terceros (ej.
          propiedad intelectual).
          {"\n"}• Enviar spam, virus, o realizar suplantación de identidad.
          {"\n"}• Compartir material sexual explícito o violento.
        </Text>
        <Text style={styles.subtitle}>XHealth puede:</Text>
        <Text style={styles.text}>
          • Eliminar contenido inapropiado sin previo aviso.
          {"\n"}• Suspender cuentas por violaciones a estos términos.
        </Text>

        <Text style={styles.sectionTitle}>3. Propiedad Intelectual</Text>
        <Text style={styles.text}>
          Todo el contenido de XHealth (diseños, textos, software, logotipos) es
          propiedad de [Nombre de la Empresa] o sus licenciantes.
        </Text>
        <Text style={styles.subtitle}>Uso permitido:</Text>
        <Text style={styles.text}>
          Personal y no comercial. Prohibida su reproducción, modificación o
          distribución sin autorización escrita.
        </Text>

        <Text style={styles.sectionTitle}>4. Enlaces a Terceros</Text>
        <Text style={styles.text}>
          XHealth puede incluir enlaces a sitios externos. No controlamos su
          contenido y no asumimos responsabilidad por ellos.
        </Text>

        <Text style={styles.sectionTitle}>
          5. Limitación de Responsabilidad
        </Text>
        <Text style={styles.text}>
          XHealth se proporciona "tal cual". No garantizamos su disponibilidad
          continua o libre de errores.
        </Text>
        <Text style={styles.text}>
          El usuario asume todo riesgo asociado al uso de la aplicación (ej.
          lesiones durante ejercicios).
        </Text>
        <Text style={styles.subtitle}>Exención:</Text>
        <Text style={styles.text}>
          [Nombre de la Empresa] no será responsable por daños directos,
          indirectos o consecuentes derivados del uso.
        </Text>

        <Text style={styles.sectionTitle}>
          6. Protección de Datos Personales
        </Text>
        <Text style={styles.text}>
          El tratamiento de datos personales se rige por la Ley 1581 de 2012
          (Colombia) y nuestra Política de Privacidad.
        </Text>
        <Text style={styles.text}>
          El usuario otorga consentimiento expreso para el uso de sus datos
          conforme a lo allí establecido.
        </Text>

        <Text style={styles.sectionTitle}>7. Duración y Terminación</Text>
        <Text style={styles.text}>
          Estos términos son efectivos desde el registro hasta su terminación
          por el usuario o XHealth.
        </Text>
        <Text style={styles.text}>
          XHealth puede suspender cuentas por actividades fraudulentas o
          violaciones a estos términos.
        </Text>

        <Text style={styles.sectionTitle}>8. Ley Aplicable y Jurisdicción</Text>
        <Text style={styles.text}>
          Estos términos se rigen por las leyes de Colombia.
        </Text>
        <Text style={styles.text}>
          Cualquier disputa se resolverá en los tribunales de [Ciudad,
          Colombia], con renuncia expresa a otros fueros.
        </Text>

        <Text style={styles.sectionTitle}>9. Disposiciones Generales</Text>
        <Text style={styles.subtitle}>Cesión:</Text>
        <Text style={styles.text}>
          XHealth puede transferir estos términos a terceros. Los usuarios no.
        </Text>
        <Text style={styles.subtitle}>Nullidad:</Text>
        <Text style={styles.text}>
          Si una cláusula es declarada inválida, el resto permanece vigente.
        </Text>

        <Text style={styles.footer}>
          Al utilizar esta aplicación, aceptas los términos y condiciones aquí
          presentados.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: "10%",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  effectiveDate: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  listItem: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
    marginBottom: 5,
  },
  footer: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 30,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default TermsScreen;
