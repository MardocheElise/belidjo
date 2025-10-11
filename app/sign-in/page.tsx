"use client";
import VendorLoginModal from "@/components/VendorLoginModal";

export default function SignInpage() {
  return <VendorLoginModal isOpen={true} onClose={() => true} />;
}
