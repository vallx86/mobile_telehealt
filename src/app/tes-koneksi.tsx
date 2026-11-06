import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function TesKoneksi() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState("");

  async function tesLogin() {
    if (!email.trim() || !password) {
      setHasil("Isi email dan password dulu ya.");
      return;
    }

    setLoading(true);
    setHasil("Mencoba login ke Supabase...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setHasil("Login gagal: " + error.message);
      } else if (data.user) {
        setHasil(
          "BERHASIL! MindCare sudah terhubung " +
            "ke Supabase dan akun berhasil login.",
        );
      }
    } catch (err) {
      setHasil("Koneksi gagal. Periksa internet dan konfigurasi Supabase.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>MindCare ♡</Text>

        <Text style={styles.subtitle}>Tes Koneksi Supabase</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email akun Supabase"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={tesLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Tes Login Supabase</Text>
          )}
        </Pressable>

        {hasil !== "" && (
          <View style={styles.result}>
            <Text style={styles.resultText}>{hasil}</Text>
          </View>
        )}

        <Text style={styles.note}>
          Halaman ini hanya untuk pengujian. Tidak menyimpan password di kode.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4A4A4A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    color: "#4A4A4A",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#FFF5F5",
    borderColor: "#F7D6D0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    marginBottom: 18,
    color: "#4A4A4A",
  },
  button: {
    backgroundColor: "#E2B4BD",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#4A4A4A",
    fontWeight: "bold",
  },
  result: {
    backgroundColor: "#F7D6D0",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  resultText: {
    color: "#4A4A4A",
    textAlign: "center",
  },
  note: {
    marginTop: 20,
    fontSize: 11,
    color: "#888888",
    textAlign: "center",
  },
});
