import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Necesario para los íconos

const ProfileScreen = () => {
  const name = "Johelin Pascual Perez Valdez";
  const matricula = "2022-1131";
  const email = "johelinperez@gmail.com";
  const linkedinURL = ""; // Sin LinkedIn por el momento
  const githubURL = "https://github.com/wazxo";

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleLinkedInPress = () => {
    if (linkedinURL) {
      Linking.openURL(linkedinURL);
    }
  };

  const handleGitHubPress = () => {
    Linking.openURL(githubURL);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/foto2x2.jpg")} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.info}>
          <Text style={styles.boldText}>Matrícula: </Text>
          {matricula}
        </Text>

        <Text style={styles.sectionTitle}>Sobre mí</Text>
        <Text style={styles.description}>
          Soy un estudiante de desarrollo de software en el ITLA, enfocado en
          crear soluciones innovadoras con tecnologías modernas. Me especializo
          en desarrollo de aplicaciones móviles con React Native y JavaScript,
          además tengo conocimientos básicos de SQL y algo de C#.
        </Text>

        <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
        <Text style={styles.skills}>
          - React Native{"\n"}- JavaScript{"\n"}- SQL (básico){"\n"}- C#
          (básico){"\n"}
        </Text>

        <Text style={styles.sectionTitle}>Redes Sociales</Text>
        <View style={styles.socials}>
          {linkedinURL ? (
            <TouchableOpacity onPress={handleLinkedInPress}>
              <FontAwesome
                name="linkedin"
                size={30}
                color="#0A66C2"
                style={styles.icon}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={handleGitHubPress}>
            <FontAwesome
              name="github"
              size={30}
              color="#333333" // Cambiado a gris oscuro
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
          <Text style={styles.buttonText}>Contáctame</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Fondo blanco
    paddingBottom: 60,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#FF6F61",
    marginBottom: 20,
    marginTop: 50,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6F61", // Manteniendo el color principal
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: "#333333", // Texto en gris oscuro
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: "#333333", // Texto en gris oscuro
    marginBottom: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#555555", // Texto en gris medio
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  skills: {
    fontSize: 16,
    color: "#555555", // Texto en gris medio
    textAlign: "left",
    marginBottom: 20,
  },
  socials: {
    flexDirection: "row",
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#FF6F61", // Color del botón
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF", // Texto del botón en blanco
    fontSize: 18,
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333333", // Texto en gris oscuro
  },
});
