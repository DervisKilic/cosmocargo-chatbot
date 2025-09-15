"use client";

import React from "react";
import {
  Rocket,
  Shield,
  Zap,
  Globe,
  Package,
  FileText,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="space-card p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-space-secondary flex items-center justify-center text-space-accent-purple">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-medium text-center mb-3">{title}</h3>
      <p className="text-space-text-secondary text-center">{description}</p>
    </div>
  );
};

const FeatureList = () => {
  const features = [
    {
      icon: <Rocket size={24} />,
      title: "Snabba Leveranser",
      description:
        "Leveranser som når målet i tid, oavsett destination i galaxen.",
    },
    {
      icon: <Shield size={24} />,
      title: "Säker Frakt",
      description:
        "Avancerad säkerhetsteknik som skyddar din last genom hela resan.",
    },
    {
      icon: <Globe size={24} />,
      title: "9000+ Destinationer",
      description:
        "Täckning av över 9000 rymdstationer och kolonier i universum.",
    },
    {
      icon: <Zap size={24} />,
      title: "Realtidsspårning",
      description: "Följ din frakt med precisionsspårning i realtid.",
    },
    {
      icon: <Package size={24} />,
      title: "Speciallaster",
      description:
        "Anpassade lösningar för känsliga varor och levande organismer.",
    },
    {
      icon: <FileText size={24} />,
      title: "Tullförenkling",
      description:
        "Automatiserade tullformulär som förenklar intergalaktiska leveranser.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-medium text-center mb-4 space-gradient-text">
        Våra Tjänster
      </h2>
      <p className="text-space-text-secondary text-center max-w-2xl mx-auto mb-12">
        CosmoCargo™ erbjuder marknadens mest pålitliga fraktlösningar för alla
        dina behov i galaxen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Feature
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureList;
