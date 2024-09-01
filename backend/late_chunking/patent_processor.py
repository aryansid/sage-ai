import xml.etree.ElementTree as ET

class PatentProcessor:
    def extract_text(self, xml_content):
        root = ET.fromstring(xml_content)
        
        title = root.find(".//invention-title").text
        abstract = root.find(".//abstract").text
        description = ' '.join([p.text for p in root.findall(".//description/p") if p.text])
        claims = ' '.join([claim.text for claim in root.findall(".//claims/claim") if claim.text])
        
        return f"Title: {title}\n\nAbstract: {abstract}\n\nDescription: {description}\n\nClaims: {claims}"