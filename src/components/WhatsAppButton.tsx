import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5516997964255?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20os%20produtos%20MOTOREX.";

const WhatsAppButton = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco pelo WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300"
  >
    <MessageCircle size={28} fill="white" strokeWidth={0} />
  </a>
);

export default WhatsAppButton;
