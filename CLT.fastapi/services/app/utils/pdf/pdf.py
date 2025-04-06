import fitz  
from PIL import Image
import os

def salvar_capa_pdf(pdf_path: str) -> str:
    try:
        doc = fitz.open(pdf_path)
        page = doc.load_page(0) 
        pix = page.get_pixmap(dpi=150)  

        output_dir = os.path.dirname(pdf_path)  
        nome_arquivo = os.path.splitext(os.path.basename(pdf_path))[0]  
        output_path = os.path.join(output_dir, f"{nome_arquivo}_capa.jpg") 

        os.makedirs(output_dir, exist_ok=True)  
        pix.save(output_path)  

        print(f"Capa salva em: {output_path}")
        print(pix.width, pix.height)
        return output_path
    except Exception as e:
        raise RuntimeError(f"Erro ao gerar capa do PDF: {str(e)}")
