// src/pages/About.jsx
import React from 'react';

export default function About() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Barrett's Oesophagus Surveillance Risk Stratification Tool</h1>
      <h2 className="text-xl font-bold mb-2 text-gray-800"> Overview of the tool </h2>
      <p className="text-gray-700 text-lg mb-2 leading-relaxed">
        This tool is designed for patients diagnosed with Barrett's oesophagus who are undergoing surveillance for dysplasia and oesophageal adenocarcinoma (OAC). It is designed for healthcare 
        providers to assess and update a patient's risk of progression to dysplaisa or OAC. Based on their risk status, the tool also provides recommendations for the appropriate surveillance 
        pathway. 
      </p>
      <p className="text-gray-700 text-lg mb-4 leading-relaxed">
        The risk stratification was developed for the capsule sponge, a pan-oesophageal cell sampling device. It follows an evidence-based 
        method from <a href="https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(21)00667-7/fulltext" target="_blank" rel="noopener noreferrer" className="text-blue-500 ">Pilonis et al. (2022) </a> 
        and has been tested in real-world settings <a href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(25)01021-9/fulltext" target="_blank" rel="noopener noreferrer" className="text-blue-500">(Tan et al, 2025) </a>.
        The capsule sponge assesses the following biomarkers: 
        <ul className="list-disc list-inside text-gray-700 text-lg">
          <li>Glandular atypia</li>
          <li>Abnormal expression of p53</li>
        </ul>
      </p>
      <p className="text-gray-700 text-lg mb-4 leading-relaxed">
        If a capsule sponge test is not available, the tool can still generate a risk estimate using the following clinical biomarkers: 
        <ul className="list-disc list-inside text-gray-700 text-lg">
          <li>Age</li>
          <li>Assigned sex at birth</li>
          <li>Prague circumferential length (C)</li>
          <li>Prague maximal length (M)</li>
          <li>Low grade dysplasia on any prior endoscopy</li>
          <li>Indefinite for dysplasia on the most recent endoscopy</li>
        </ul>
      </p>
      <h2 className="text-xl font-bold mb-2 text-gray-800">How the tool works</h2>
      <p className="text-gray-700 text-lg mb-4 leading-relaxed">
        The tool will stratify patients into the following four groups: 
        <ul className="list-disc list-inside text-gray-700 text-lg">
          <li> <span className="text-rose-800">Very high risk:</span> atypia positive <b>or</b> p53 positive </li>
          <li> <span className="text-rose-800">High risk:</span> at least one of atypia of uncertain significance or equivocal p53</li>
          <li> <span className="text-amber-600">Moderate risk:</span> at least one of the following are satisfied</li>
          <p className="text-gray-700 text-lg mb-0 indent-8">
            <ul className="list-disc list-inside text-gray-700 text-lg">
              <li>low grade dysplasia on any prior endoscopy or indefinite for dysplasia on the most recent endoscopy</li>
              <li>at least one of M {">"} 10 or C {">"} 6</li>
              <li>at least one of M {">"} 5 or C {">"} 2 <b>and</b> at least one of age {">"} 60 or assigned male at birth</li>
            </ul>
          </p>
          <li> <span className="text-emerald-600">Low risk:</span> negative for both capsule sponge biomarkers and negative for clinical biomarkers</li>
        </ul>
      </p>

      <h2 className="text-xl font-bold mb-2 text-gray-800">Resources on Barrett's oesophagus and the capsule sponge </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        <a href="https://www.cancerresearchuk.org/about-cancer/other-conditions/barretts-oesophagus/about-barretts" target="_blank" rel="noopener noreferrer" className="text-blue-500 "> Learn more about Barrett's oesophagus </a>
       </p> 
      <p className="text-gray-700 text-lg leading-relaxed">
        <a href="https://www.cancerresearchuk.org/health-professional/diagnosis/investigations/capsule-sponge" target="_blank" rel="noopener noreferrer" className="text-blue-500 "> Learn more about the capsule sponge </a>      
      </p>
    </div>
  );
}
