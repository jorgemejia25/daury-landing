import FadeIn from "./motion/FadeIn";
import MaterialIcon from "./MaterialIcon";

interface Testimonial {
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
}

function TestimonialCard({ quote, authorName, authorRole, authorImage }: Testimonial) {
  return (
    <div className="glass-card p-12 rounded-[3rem]">
      <div className="flex gap-1 mb-6 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <MaterialIcon key={i} name="star" />
        ))}
      </div>
      <blockquote className="text-2xl font-light italic text-on-surface mb-8 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-bright border border-white/10 overflow-hidden">
          <img alt={`Profile of ${authorName}`} src={authorImage} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold">{authorName}</p>
          <p className="text-sm text-on-surface-variant">{authorRole}</p>
        </div>
      </div>
    </div>
  );
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Daury didn't just help my father remember his medicine; it helped us remember how to be a family again, rather than just full-time caregivers.",
    authorName: "Elena R.",
    authorRole: "Daughter & Primary Caregiver",
    authorImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBw_-UQzPL3gzWhu487lm4Z4dVKDDCK2tgQPya8-5p7eexOJXekLGGCSjtjXYCzfTKir6M_zF8WO3RXxxRtoWz8nsBpvJI5MWVmPs2KwyyoBL5-_0sRybHEAQXhRRFIPIyqGyn8S1EQbjUXRnQ63nSIer5ewXqtvW1_ksgDMRh2OhJDrrvnR_InUG9F8qmcjQjKqMBoq4JFq3ZLTjGgl7LxBpgveCUAyZjxPMCfUcWYVBzwNFPxhjyiDzf4XsmaX7PKFpiddl4QPVM",
  },
  {
    quote:
      "The predictive insights gave me a 24-hour head start on a rough patch. That level of foresight is priceless for our clinical team.",
    authorName: "Dr. Marcus Vance",
    authorRole: "Cognitive Specialist",
    authorImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA03okVl3N2Cu3vt24K7urV-gedIF-PiUY_j7y4yUrJ4lqivTtLAGzcnwP7dqv4vIFPeB1oN76ATf_9KBjY4N_bFMuTqV6bzCZf7CIwe97CE--GL0N9MDA82b-cmqlYppBZ4xlrttsSkLarGt30i3DDZnRCzXwWdkQvfQAc23TKvctFjWX-djnV3kW9XKWTQrq030sMxTpDcXir1JVwButZGQVtRL42GXQ1zslnHxwLrEztIfGVJvwRc_0-NPngNGMjPOHuhntfCc8",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <FadeIn key={t.authorName} direction="up" delay={i * 0.15}>
              <TestimonialCard {...t} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
