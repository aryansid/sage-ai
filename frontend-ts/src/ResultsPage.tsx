import { Avatar, AvatarFallback } from "./@/components/ui/avatar"
import { Badge } from "./@/components/ui/badge"
import { Button } from "./@/components/ui/button"
import { Card } from "./@/components/ui/card"
import { Input } from "./@/components/ui/input"
import { ScrollArea } from "./@/components/ui/scroll-area"
import { SearchIcon } from "lucide-react"
import { useLocation } from 'react-router-dom';
import NavBar from './components/NavBar'; // Import the NavBar component
import PatentCard from './components/Patent'; // Add this import

export default function ResultsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="z-10 relative">
        <NavBar currentPage="Search" /> {/* Add the NavBar component here */}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-4 border-r border-gray-200 overflow-y-auto">
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input placeholder="Search" defaultValue={query} className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <EmailItem
              title="Method for AI-Assisted Patent Drafting"
              id="US20230123456"
              abstract="This patent describes an AI-powered system for assisting in the drafting of patent applications. The system utilizes natural language processing and machine learning algorithms to analyze existing patents and generate relevant content for new patent applications."
              labels={["AI", "Patent", "NLP"]}
              isActive={true}
            />
            <EmailItem
              title="AI-Powered Image Recognition System"
              id="US20230789012"
              abstract="This patent describes an AI-powered image recognition system that can identify objects, scenes, and patterns with high accuracy. The system utilizes convolutional neural networks and deep learning techniques to analyze images and extract meaningful information."
              labels={["AI", "Image Recognition", "CNN"]}
            />
            <EmailItem
              title="Smart Home Automation System"
              id="US20230345678"
              abstract="This patent describes a smart home automation system that integrates various devices and appliances to provide convenience and energy efficiency. The system utilizes IoT technologies and machine learning algorithms to learn user preferences and optimize performance."
              labels={["IoT", "Smart Home", "Automation"]}
            />
            <EmailItem
              title="Autonomous Vehicle Navigation System"
              id="US20230987654"
              abstract="This patent describes an autonomous vehicle navigation system that enables self-driving cars to navigate safely and efficiently in various environments. The system utilizes sensor fusion, path planning, and machine learning algorithms to ensure smooth and accurate navigation."
              labels={["Autonomous Vehicles", "Navigation", "Sensor Fusion"]}
            />
            <EmailItem
              title="Medical Diagnostic AI System"
              id="US20230234567"
              abstract="This patent describes an AI-powered medical diagnostic system that can analyze medical images and provide accurate diagnoses. The system utilizes deep learning techniques and medical domain knowledge to identify patterns and anomalies in medical images, such as X-rays and MRIs."
              labels={["AI", "Medical", "Diagnostic"]}
            />
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <PatentCard
              title="Method for AI-Assisted Patent Drafting"
              id="US20230123456"
              abstract="This patent describes an advanced AI-powered system for assisting in the drafting of patent applications. The system utilizes state-of-the-art natural language processing and machine learning algorithms to analyze existing patents, identify key components, and generate relevant content for new patent applications. By leveraging large datasets of previously granted patents and cutting-edge AI technologies, this system aims to streamline the patent drafting process, improve the quality of patent applications, and reduce the time and effort required by patent attorneys and inventors."
              specification="The present invention relates to the field of artificial intelligence and patent law. Specifically, this invention provides a novel approach to patent drafting by leveraging advanced AI technologies to assist inventors and patent attorneys in creating high-quality patent applications.

              Background:
              Patent drafting is a complex and time-consuming process that requires extensive knowledge of both technical subject matter and legal requirements. Traditional methods of patent drafting often involve manual research, analysis, and writing, which can be prone to errors and inconsistencies. The present invention addresses these challenges by introducing an AI-assisted patent drafting system.

              Detailed Description:
              The AI-assisted patent drafting system comprises several key components:
              1. Data Ingestion Module: This module collects and processes a vast database of existing patents, scientific literature, and legal documents.
              2. Natural Language Processing (NLP) Engine: The NLP engine analyzes the collected data to extract relevant information, identify patterns, and understand the structure of well-written patents.
              3. Machine Learning (ML) Model: The ML model is trained on the processed data to generate patent-specific content, including claims, descriptions, and abstracts.
              4. User Interface: A user-friendly interface allows inventors and patent attorneys to input invention details and interact with the AI system.
              5. Output Generation Module: This module compiles the AI-generated content into a cohesive patent application draft, following standard patent office formats and guidelines.

              The system operates by first analyzing the user's input regarding the invention. It then searches its database for similar patents and relevant technical information. Using this data, the AI generates an initial draft of the patent application, including claims, detailed description, and abstract. The user can then review and refine the generated content through the interface, with the AI providing suggestions and improvements based on best practices and legal requirements.

              This invention significantly reduces the time and effort required to draft a patent application while potentially improving the quality and consistency of the final document. It also helps in identifying potential prior art and ensuring that the claims are properly scoped to maximize protection for the invention."
              claims="1. A system for AI-assisted patent drafting, comprising:
                a) a data ingestion module configured to collect and process patent documents and technical literature;
                b) a natural language processing engine configured to analyze and extract relevant information from the processed documents;
                c) a machine learning model trained on the extracted information to generate patent-specific content;
                d) a user interface configured to receive input from a user regarding an invention; and
                e) an output generation module configured to compile AI-generated content into a patent application draft.

              2. The system of claim 1, wherein the machine learning model is further configured to generate patent claims, detailed descriptions, and abstracts based on the user input and analyzed documents.

              3. The system of claim 1, further comprising a feedback mechanism that allows users to refine and modify the AI-generated content.

              4. A method for AI-assisted patent drafting, comprising:
                a) receiving input from a user regarding an invention;
                b) analyzing a database of existing patents and technical literature using natural language processing;
                c) generating patent-specific content using a machine learning model trained on the analyzed database;
                d) compiling the generated content into a patent application draft; and
                e) presenting the draft to the user for review and modification.

              5. The method of claim 4, further comprising iteratively refining the patent application draft based on user feedback and additional AI-generated suggestions."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface EmailItemProps {
  title: string;
  id: string;
  abstract: string;
  labels: string[];
  isActive?: boolean;
}

function EmailItem({ title, id, abstract, labels, isActive = false }: EmailItemProps) {
  return (
    <div className={`mb-4 p-4 rounded-lg border ${isActive ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'} hover:bg-gray-100 cursor-pointer transition-colors duration-200`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs text-gray-500">ID: {id}</span>
      </div>
      <p className="text-xs text-gray-600 mb-3 text-left">{abstract}</p>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <Badge 
            key={label} 
            variant="secondary" 
            className={`text-xs px-2 py-1 ${label === 'work' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {label}
          </Badge>
        ))}
      </div>
    </div>
  )
}