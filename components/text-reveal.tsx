import TextReveal from "@/components/ui/textreveal";

export async function TextRevealDemo() {
  return (
    <div className="z-10 flex min-h-[16rem] text-normal items-center justify-center ">
      <TextReveal text="In the age of the Fourth Industrial Revolution. You either live above API or below it." />
    </div>
  );
}
