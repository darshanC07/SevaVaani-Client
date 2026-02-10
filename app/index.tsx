import { Redirect } from "expo-router";
import { useEffect } from "react";
import { startBackgroundLocation } from "./_layout";
export default function Index() {
  useEffect(() => {
    startBackgroundLocation();
  }, []);
 // return <Redirect href="/registration/EmailScreen" />;
  // return <Redirect href="/client" />;
  // return <Redirect href="/AppWriteOTP" />;
  return <Redirect href="/registration" />;
}