import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native"

const LoadingOverlay = ({ visible, text = "Cargando...", spinnerColor = "#FFFFFF", textColor = "#FFFFFF" }) => {
    if (!visible) return null

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color={spinnerColor} />
                    <Text style={[styles.text, { color: textColor }]}>{text}</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    loadingBox: {
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "500",
    },
})

export default LoadingOverlay

