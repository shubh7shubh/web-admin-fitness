import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-500 to-cyan-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Fitness Journey?
        </h2>
        <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
          Join thousands of users already tracking their nutrition, completing challenges, 
          and achieving their goals with FitnessApp.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl">
              Download for iOS
            </Button>
          </Link>
          <Link href="#">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
              Download for Android
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
