import { Check } from "lucide-react"
import { Button } from "./@/components/ui/button"
import { Switch } from "./@/components/ui/switch"
import NavBar from './components/NavBar'  // Add this import

export default function PricingPage() {  // Rename Component to PricingPage
  return (
    <>
      <NavBar currentPage="Pricing" />
      <div className="w-full min-h-screen bg-white text-black py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">Pricing</h1>
          <p className="text-xl text-center mb-16 text-gray-600 max-w-3xl mx-auto">
            Empower your patent law practice with our advanced prior art search tool. Choose the plan that best fits your needs and enhance your patent research capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                title: "Basic",
                price: "$49",
                description: "For individual practitioners",
                features: [
                  "100 searches per month",
                  "Access to global patent databases",
                  "Basic search filters",
                  "PDF report generation",
                ],
                cta: "Start free trial",
              },
              {
                title: "Professional",
                price: "$149",
                description: "For small law firms",
                discount: "-10%",
                features: [
                  "500 searches per month",
                  "Advanced search algorithms",
                  "Citation analysis",
                  "Customizable reports",
                  "Email support",
                ],
                cta: "Start free trial",
              },
              {
                title: "Business",
                price: "$399",
                description: "For medium to large firms",
                discount: "-15%",
                features: [
                  "Unlimited searches",
                  "AI-powered relevance scoring",
                  "Collaborative workspaces",
                  "Integration with patent management software",
                  "Priority phone support",
                ],
                cta: "Start free trial",
                ctaAlt: "Contact sales",
                highlighted: true,
              },
              {
                title: "Enterprise",
                price: "Custom pricing",
                description: "For large corporations and institutions",
                features: [
                  "All Business plan features",
                  "Custom AI model training",
                  "Dedicated account manager",
                  "On-premise deployment option",
                  "API access for integration",
                  "24/7 premium support",
                ],
                cta: "Contact sales",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`border rounded-lg p-8 flex flex-col justify-between ${
                  plan.highlighted ? "border-black shadow-lg" : "border-gray-200"
                }`}
              >
                <div>
                  <h2 className="text-2xl font-bold mb-4">{plan.title}</h2>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom pricing" && <span className="ml-2 text-gray-600">per user/month</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  {plan.discount && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-6 inline-block">
                      {plan.discount}
                    </span>
                  )}
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Button className="w-full mb-2">{plan.cta}</Button>
                  {plan.ctaAlt && (
                    <Button variant="outline" className="w-full">
                      {plan.ctaAlt}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-gray-600">Monthly</span>
            <Switch id="billing-toggle" />
            <span className="font-medium">Yearly (Save 20%)</span>
          </div>
        </div>
      </div>
    </>
  )
}