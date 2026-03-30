import { Eye, Mic, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div
      className="container mx-auto px-4 py-10 max-w-4xl"
      data-ocid="about.section"
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/assets/uploads/1773553344647-019d1c24-b9ed-7468-ab15-14552f5bfdfc-11.png"
          alt="Veritas News"
          className="h-24 w-auto mx-auto mb-5"
        />
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-3">
          VERITAS NEWS
        </h1>
        <p className="text-primary text-lg font-bold tracking-[0.3em] uppercase mb-6">
          The Untold Indian
        </p>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          India's emerging voice for truth-first journalism. We cover the
          stories that matter, from the ground up.
        </p>
      </motion.div>

      <motion.div
        className="mb-12 rounded-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <img
          src="/assets/uploads/1774009120498-019d1c24-ba98-778d-a31b-3785cc8d2365-12.png"
          alt="Veritas News Channel"
          className="w-full object-cover"
        />
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="font-headline font-bold text-2xl text-foreground mb-4">
          Our Story
        </h2>
        <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border">
          <video
            src="/assets/uploads/veritas_news_0-019d1c24-cbd5-71f7-8ada-ab55b6d2d761-1.mp4"
            controls
            className="w-full h-full"
            poster="/assets/uploads/1774156124339_1-019d1c24-b109-7791-acc0-fea1fbb0b0f9-1.png"
          >
            <track kind="captions" label="No captions available" />
          </video>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Shield,
            title: "Truth First",
            description:
              "Every story we publish goes through rigorous fact-checking. We stand by accuracy above all else.",
          },
          {
            icon: Eye,
            title: "The Untold Stories",
            description:
              "We shine light on the stories that mainstream media ignores — from grassroots India to global power corridors.",
          },
          {
            icon: Mic,
            title: "Independent Voice",
            description:
              "Veritas News is editorially independent. No political affiliations. No corporate agenda. Just journalism.",
          },
        ].map((val, i) => (
          <motion.div
            key={val.title}
            className="bg-card rounded-lg border border-border p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <val.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg text-foreground mb-2">
              {val.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {val.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="bg-card border border-primary/30 rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <h2 className="font-headline font-bold text-2xl text-foreground mb-4">
          Our Mission
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Veritas News was founded with one mission: to tell the untold stories
          of India. In a media landscape often dominated by noise and agendas,
          we are committed to facts, depth, and the kind of reporting that
          creates informed citizens. From Gujarat's vibrant culture to the
          corridors of Delhi's power, from rural heartlands to global affairs —
          we cover it all with integrity.
        </p>
        <div className="mt-6">
          <img
            src="/assets/uploads/1774156124339_1-019d1c24-b109-7791-acc0-fea1fbb0b0f9-1.png"
            alt="The Untold Indian"
            className="h-20 w-auto mx-auto opacity-90"
          />
        </div>
      </motion.div>
    </div>
  );
}
