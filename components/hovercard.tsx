import { HoverEffect } from "@/components/ui/hovercard";

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Research",
    description:
      "I'm open to work research projects on ML, data science, quantitiative finance, and GenAI feild. ",
    link: "https://cal.com/vats1910",
  },
  {
    title: "Mentorship and Tutoring",
    description:
      "I offer Study Aboard strategies, resume reviews and teach students about basics of Software Development and Machine learning.",
    link: "https://cal.com/vats1910",
  },
  {
    title: "Study Aboard",
    description:
      "I will help you strategise of your University selection and give SOP review.",
    link: "https://cal.com/vats1910",
  },
];
