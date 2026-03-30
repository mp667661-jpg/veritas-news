import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, MessageSquare, Send, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddContactMessage } from "../hooks/useQueries";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate: addMessage, isPending } = useAddContactMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    addMessage(
      {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: BigInt(Date.now() * 1_000_000),
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast.success("Message sent!");
        },
        onError: () => toast.error("Failed to send. Please try again."),
      },
    );
  };

  return (
    <div
      className="container mx-auto px-4 py-10 max-w-2xl"
      data-ocid="contact.section"
    >
      <div className="mb-8">
        <div className="section-divider" />
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground">
          Contact Us
        </h1>
        <p className="text-muted-foreground mt-1">
          Send us a news tip, feedback, or inquiry.
        </p>
      </div>

      {submitted ? (
        <motion.div
          className="text-center py-16 bg-card rounded-xl border border-border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          data-ocid="contact.success_state"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-headline font-bold text-xl text-foreground mb-2">
            Message Sent!
          </h2>
          <p className="text-muted-foreground">
            We'll get back to you as soon as possible.
          </p>
          <Button
            className="mt-6 bg-primary hover:bg-primary/90"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setEmail("");
              setMessage("");
            }}
          >
            Send Another
          </Button>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          data-ocid="contact.panel"
        >
          <div className="space-y-2">
            <Label
              htmlFor="contact-name"
              className="flex items-center gap-2 text-foreground"
            >
              <User className="w-4 h-4" /> Name
            </Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="bg-input border-border focus:border-primary text-foreground"
              data-ocid="contact.input"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="contact-email"
              className="flex items-center gap-2 text-foreground"
            >
              <Mail className="w-4 h-4" /> Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="bg-input border-border focus:border-primary text-foreground"
              data-ocid="contact.input"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="contact-message"
              className="flex items-center gap-2 text-foreground"
            >
              <MessageSquare className="w-4 h-4" /> Message
            </Label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message, news tip, or feedback..."
              required
              rows={5}
              className="bg-input border-border focus:border-primary text-foreground resize-none"
              data-ocid="contact.textarea"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11"
            data-ocid="contact.submit_button"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </span>
            )}
          </Button>
        </motion.form>
      )}
    </div>
  );
}
