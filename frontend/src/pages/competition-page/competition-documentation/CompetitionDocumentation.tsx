import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import styles from "./CompetitionDocumentation.module.css";
import cppIcon from "../../../assets/cppIcon.svg";
import javaIcon from "../../../assets/javaIcon.svg";
import pythonIcon from "../../../assets/pythonIcon.svg";

const CompetitionDocumentation = () => {
  const navigate = useNavigate();

  const languages = [
    {
      name: "C++",
      description:
        "A fast, compiled language with STL support. We are using version X.",
      docUrl: "https://cppreference.com/",
      image: cppIcon,
      color: "bg-[#808CF8]",
    },
    {
      name: "Java",
      description:
        "A cross-platform, object-oriented programming language. We are using version X.",
      docUrl: "https://docs.oracle.com/en/java/",
      image: javaIcon,
      color: "bg-[#F87171]",
    },
    {
      name: "Python",
      description:
        "An easy to read scripting language great for quick development. We are using version X.",
      docUrl: "https://docs.python.org/3/",
      image: pythonIcon,
      color: "bg-[#FDC700]",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <button onClick={() => navigate("/home")} className={styles.backButton}>
          <FontAwesomeIcon icon={faHouse} className={styles.icon} />
        </button>
        <h1 className={styles.heading}>Documentation</h1>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-4">
        {languages.map((language) => (
          <Card
            key={language.name}
            className="border border-[#2F2F2F] bg-[#171717]"
          >
            <CardContent className=" px-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3 text-white">
                    {language.name}
                  </h2>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {language.description}
                  </p>
                  <Button
                    variant="outline"
                    className="border-[#2F2F2F] hover:bg-[#2F2F2F] text-white bg-transparent cursor-pointer"
                    onClick={() => window.open(language.docUrl, "_blank")}
                  >
                    View Documentation
                    <FontAwesomeIcon
                      icon={faExternalLink}
                      className="ml-2 h-4 w-4"
                    />
                  </Button>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`w-20 h-20 rounded-lg ${language.color} flex items-center justify-center`}
                  >
                    <img
                      src={language.image || "/placeholder.svg"}
                      alt={`${language.name} logo`}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompetitionDocumentation;
