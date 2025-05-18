import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { StyleSheet, View } from "react-native";

import DashboardUi from "../components/dashboard/dashboardUi"; // Adjust the path if needed

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* <GlobalHeader /> */}
      <DashboardUi />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // If using React Native >=0.71, otherwise use marginLeft on powerButton
  },
  text: { fontSize: 24, fontWeight: "bold" },
  powerButton: {
    marginLeft: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
    padding: 6,
  },
});
