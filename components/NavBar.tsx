import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const NavBar = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const currentLanguage = i18n.language.toUpperCase();

  const languages = [
    { code: 'en', label: 'English', display: 'EN' },
    { code: 'hi', label: 'हिंदी', display: 'HI' },
    { code: 'mr', label: 'मराठी', display: 'MR' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setShowLanguageMenu(false);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>{t('navbar.appName')}</Text>
      <View style={styles.rightSide}>
        <TouchableOpacity onPress={() => router.push("/client/Notifications")}>
          <Image
            source={require("../assets/navbar/notification.png")}
            style={{ width: 25, height: 25 }}
          /></TouchableOpacity>
        <TouchableOpacity style={styles.languageIcon} onPress={() => setShowLanguageMenu(true)}>
          <Image
            source={require("../assets/navbar/language.png")}
            style={{ width: 30, height: 30 }}
          />
          <Text style={styles.lang}>{currentLanguage}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={showLanguageMenu}
        animationType="fade"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLanguageMenu(false)}
        >
          <View style={styles.languageMenu}>
            <Text style={styles.menuTitle}>{t('navbar.selectLanguage')}</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  i18n.language === lang.code && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={[
                  styles.languageLabel,
                  i18n.language === lang.code && styles.selectedLanguageText
                ]}>
                  {lang.label}
                </Text>
                <Text style={[
                  styles.languageCode,
                  i18n.language === lang.code && styles.selectedLanguageText
                ]}>
                  {lang.display}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4560F4",
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    margin: 15,
  },
  rightSide: {
    flexDirection: "row",
    marginRight: 15,
  },
  languageIcon: {
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBlockColor: 'black',
    backgroundColor: '#D7D3D3',
    borderRadius: 10,
    paddingHorizontal: 5,
    gap: 2
  },
  lang: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageMenu: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4560F4',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  selectedLanguage: {
    backgroundColor: '#4560F4',
    borderColor: '#4560F4',
  },
  languageLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  languageCode: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  selectedLanguageText: {
    color: 'white',
  },
});
