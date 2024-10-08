import { Button } from "@/components/ui/button";
import BoxReveal from "@/components/ui/box-reveal";

export async function BoxRevealDemo() {
  return (
    <div className="h-full w-full max-w-[32rem] items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#7a6f60"} duration={0.5}>
        <p className="text-[3.5rem] font-semibold">
          Hi! I'm Vatsal<span className="text-[#7a6f60]">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#7a6f60"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem]">
        Good to see you over here.{" "}
          <span className="text-[#7a6f60]">Design Engineers</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#7a6f60"} duration={0.5}>
        <div className="mt-[1.5rem]">
          <p>
            -&gt; 20+ free and open-source animated components built with
            <span className="font-semibold text-[#7a6f60]"> React</span>,
            <span className="font-semibold text-[#7a6f60]"> Typescript</span>,
            <span className="font-semibold text-[#7a6f60]"> Tailwind CSS</span>,
            and
            <span className="font-semibold text-[#7a6f60]"> Framer Motion</span>
            . <br />
            -&gt; 100% open-source, and customizable. <br />
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#7a6f60"} duration={0.5}>
        <Button className="mt-[1.6rem] bg-[#7a6f60]">Explore</Button>
      </BoxReveal>
    </div>
  );
}
