import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function TesAI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState(
    "Halo MindCare, aku sedang merasa cemas. Apa yang bisa aku lakukan?",
  );
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);

  async function tesGemini() {
    setLoading(true);
    setJawaban("");

    try {
      // Login menggunakan akun Supabase sungguhan
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) throw loginError;

      // Kirim pertanyaan ke AI Erin
      const { data, error } = await supabase.functions.invoke(
        "mindcare-ai-chat",
        {
          body: {
            message: pesan,
          },
        },
      );

      if (error) throw error;

      if (!data?.success || typeof data.reply !== "string") {
        throw new Error(data?.error || "Jawaban AI tidak valid.");
      }

      setJawaban(data.reply);
    } catch (error: any) {
      setJawaban("ERROR: " + (error?.message || "Tidak diketahui"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#FFF5F5",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 22,
          borderRadius: 20,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "#4A4A4A",
            textAlign: "center",
          }}
        >
          MindCare AI ♡
        </Text>

        <Text>Email akun Supabase</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          style={{ backgroundColor: "#FFF5F5", padding: 13, borderRadius: 12 }}
        />

        <Text>Password akun Supabase</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          style={{ backgroundColor: "#FFF5F5", padding: 13, borderRadius: 12 }}
        />

        <Text>Pertanyaan untuk Gemini</Text>
        <TextInput
          value={pesan}
          onChangeText={setPesan}
          multiline
          style={{
            backgroundColor: "#FFF5F5",
            padding: 13,
            borderRadius: 12,
            minHeight: 85,
          }}
        />

        <Pressable
          disabled={loading}
          onPress={tesGemini}
          style={{
            backgroundColor: "#E2B4BD",
            padding: 15,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#4A4A4A" }}>
            Tes Gemini dari Expo
          </Text>
        </Pressable>

        {loading && <ActivityIndicator color="#A66E80" />}

        {jawaban !== "" && (
          <View
            style={{
              backgroundColor: "#F7D6D0",
              padding: 16,
              borderRadius: 14,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Hasil:</Text>
            <Text style={{ color: "#4A4A4A", marginTop: 8 }}>{jawaban}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
