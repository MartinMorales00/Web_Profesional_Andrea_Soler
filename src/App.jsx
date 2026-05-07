import React, { useState } from 'react';
import { productosSeguros } from './data'; // Importamos la lista
import { supabase } from './supabaseClient';

function App() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', fechaNac: '', sexo: '', email: '', tel: ''
  });

  const enviarWhatsApp = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('prospectos')
        .insert([
          { 
            nombre: formData.nombre, 
            fecha_nacimiento: formData.fechaNac, 
            sexo: formData.sexo, 
            email: formData.email, 
            telefono: formData.tel,
            producto: productoSeleccionado.titulo
          }
        ]);

      if (error) throw error;

      const nroAndrea = "5492235768960"; 
      const mensaje = `Hola Andrea! Mi nombre es ${formData.nombre}. Me interesa el seguro de *${productoSeleccionado.titulo}*.
Mis datos:
- Nacimiento: ${formData.fechaNac}
- Sexo: ${formData.sexo}
- Email: ${formData.email}
- Tel: ${formData.tel}`;
      const url = `https://api.whatsapp.com/send?phone=${nroAndrea}&text=${encodeURIComponent(mensaje)}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
      setModalAbierto(false);

    } catch (error) {
      console.error("Error al guardar datos:", error.message);
      alert("Hubo un problema al procesar tus datos, pero podés contactarme igual por WhatsApp.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/favicon_logo.png" alt="Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-xl font-bold text-gray-800">Andrea Verónica Soler</h1>
          </div>
          <nav className="hidden md:block text-red-800 font-bold uppercase text-sm tracking-widest">Actis y Bayugar</nav>
        </div>
      </header>

      {/* SECTION HERO - AJUSTADA PARA NO VERSE "COMO EL ORTO" */}
      <section className="relative w-full overflow-hidden bg-[#8B1A1A]">
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]">
          <img 
            src="/portada.jpg" 
            alt="Andrea Soler" 
            className="absolute inset-0 w-full h-full object-cover object-[center_15%]" 
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
      </section>

      {/* GRILLA DE PRODUCTOS */}
      <main className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nuestros Seguros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productosSeguros.map((prod) => (
            <div key={prod.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all">
              <span className="text-5xl mb-4">{prod.icono}</span>
              <h3 className="text-xl font-bold mb-3">{prod.titulo}</h3>
              <p className="text-gray-600 mb-6 flex-grow text-sm">{prod.descripcion}</p>
              <button 
                onClick={() => { setProductoSeleccionado(prod); setModalAbierto(true); }}
                className="bg-[#8B1A1A] text-white font-bold py-3 rounded-xl hover:bg-red-900 transition"
              >
                Cotizar ahora
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* SECCIÓN CONTACTO (FOOTER) - DISEÑO FINAL CORREGIDO */}
      <footer className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto bg-white border border-red-100 rounded-[50px] p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center gap-12">
          
          {/* Logo circular izquierda */}
          <div className="flex-shrink-0">
            <img 
              src="/favicon_logo.png" 
              alt="Logo Actis y Bayugar" 
              className="w-32 h-32 md:w-44 md:h-44 object-contain"
            />
          </div>

          {/* Información de contacto */}
          <div className="flex-grow w-full">
            <h2 className="text-3xl font-bold text-[#8B1A1A] mb-8">Contactanos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* Columna Izquierda: Dir y Email */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-[#8B1A1A] font-bold flex items-center gap-2 mb-2 uppercase text-sm tracking-wide">
                    <span>📍</span> Dirección
                  </h4>
                  <p className="text-gray-700 font-medium text-lg ml-6">Av. Constitución 4635</p>
                </div>
                <div>
                  <h4 className="text-[#8B1A1A] font-bold flex items-center gap-2 mb-2 uppercase text-sm tracking-wide">
                    <span>✉️</span> Email
                  </h4>
                  <p className="text-gray-700 font-medium text-lg ml-6 break-all">andreaveronicasoler@gmail.com</p>
                </div>
              </div>

              {/* Columna Derecha: Cel y Redes */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-[#8B1A1A] font-bold flex items-center gap-2 mb-2 uppercase text-sm tracking-wide">
                    <span>📞</span> Celulares
                  </h4>
                  <div className="text-gray-700 font-medium text-lg ml-6 space-y-1">
                    <p>2236825335</p>
                    <p>2234711123</p>
                    <p>2234714585</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[#8B1A1A] font-bold mb-4 uppercase text-sm tracking-wide">Redes Sociales</h4>
                  <div className="flex gap-4 ml-2">
                    {/* Botones de redes sociales con imágenes oficiales vía URL para que no fallen */}
                    <a href="https://www.facebook.com/andreaveronicasoler/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-red-100 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="FB" className="w-6 h-6" />
                    </a>
                    <a href="https://www.instagram.com/soler_andrea_seguros/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-red-100 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="IG" className="w-6 h-6" />
                    </a>
                    <a href="https://www.linkedin.com/in/andrea-veronica-soler-0966822a/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-red-100 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="IN" className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </footer>

      {/* MODAL FORMULARIO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Cotizar {productoSeleccionado.titulo}</h3>
            <p className="text-sm text-gray-500 mb-6">Andrea necesita estos datos para enviarte la propuesta.</p>
            
            <form onSubmit={enviarWhatsApp} className="space-y-4">
              <input required placeholder="Nombre y Apellido" className="w-full p-3 bg-gray-50 rounded-xl border outline-none focus:border-red-500" 
                onChange={e => setFormData({...formData, nombre: e.target.value})} />
              
              <div className="flex gap-4">
                <input required type="date" className="w-1/2 p-3 bg-gray-50 rounded-xl border outline-none"
                  onChange={e => setFormData({...formData, fechaNac: e.target.value})} />
                <select required className="w-1/2 p-3 bg-gray-50 rounded-xl border outline-none text-gray-500"
                  onChange={e => setFormData({...formData, sexo: e.target.value})}>
                  <option value="">Sexo</option>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                  <option value="X">Otro</option>
                </select>
              </div>

              <input required type="email" placeholder="Email" className="w-full p-3 bg-gray-50 rounded-xl border outline-none focus:border-red-500" 
                onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="tel" placeholder="WhatsApp (Ej: 223...)" className="w-full p-3 bg-gray-50 rounded-xl border outline-none focus:border-red-500" 
                onChange={e => setFormData({...formData, tel: e.target.value})} />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalAbierto(false)} className="flex-1 py-3 text-gray-400 font-medium">Cancelar</button>
                <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
                  Pedir WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;