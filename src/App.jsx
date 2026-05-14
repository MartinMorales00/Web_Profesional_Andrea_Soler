import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// --- COMPONENTE 1: PANEL DE ADMINISTRADOR (FUERA PARA EVITAR RE-RENDERS) ---
const AdminPanel = ({ productos, formAdmin, setFormAdmin, guardarProducto, eliminarProducto, editandoId, setEditandoId, cerrarSesion }) => {
  return (
    <div className="container mx-auto p-8 min-h-screen animate-in fade-in duration-500 relative">
      
      {/* BOTÓN VOLVER */}
      <div className="flex justify-start mb-6">
        <button 
          onClick={cerrarSesion}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#8B1A1A] transition-colors group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> 
          Volver al Sitio Principal
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-red-100">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#8B1A1A]">Panel de Gestión de Seguros</h2>
            <span className="bg-red-50 text-[#8B1A1A] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Modo Editor</span>
        </div>
        
        <form onSubmit={guardarProducto} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-[#FDF8F5] p-6 rounded-2xl">
          <input 
            type="text"
            placeholder="Título (ej: Seguro Automotor)" 
            className="p-3 rounded-xl border outline-none focus:border-[#8B1A1A] bg-white text-gray-800" 
            value={formAdmin.titulo} 
            onChange={(e) => setFormAdmin({ ...formAdmin, titulo: e.target.value })} 
            required 
          />
          <input 
            type="text"
            placeholder="Emoji (ej: 🚗)" 
            className="p-3 rounded-xl border outline-none focus:border-[#8B1A1A] bg-white text-gray-800" 
            value={formAdmin.icono} 
            onChange={(e) => setFormAdmin({ ...formAdmin, icono: e.target.value })} 
          />
          <textarea 
            placeholder="Descripción del seguro..." 
            className="p-3 rounded-xl border md:col-span-2 outline-none focus:border-[#8B1A1A] min-h-[100px] bg-white text-gray-800" 
            value={formAdmin.descripcion} 
            onChange={(e) => setFormAdmin({ ...formAdmin, descripcion: e.target.value })} 
            required 
          />
          <div className="flex items-center gap-4">
            <button type="submit" className="bg-[#8B1A1A] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-900 transition shadow-md">
              {editandoId ? 'Actualizar Seguro' : 'Agregar Nuevo Seguro'}
            </button>
            {editandoId && (
              <button 
                type="button" 
                onClick={() => { setEditandoId(null); setFormAdmin({ titulo: '', descripcion: '', icono: '' }); }} 
                className="text-gray-400 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>

        {/* ... Resto de la lista de productos ... */}
        <div className="grid gap-4">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-2">Seguros Activos</h3>
          {productos.map(p => (
            <div key={p.id} className="flex justify-between items-center p-4 bg-white border rounded-2xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <span className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl">{p.icono}</span>
                <div>
                  <h4 className="font-bold text-gray-800">{p.titulo}</h4>
                  <p className="text-sm text-gray-400">{p.descripcion.substring(0, 60)}...</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setEditandoId(p.id); setFormAdmin(p); }} className="text-blue-600 font-bold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">Editar</button>
                <button onClick={() => eliminarProducto(p.id)} className="text-red-600 font-bold hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">Borrar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
function App() {
  // --- ESTADOS ---
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', fechaNac: '', email: '', tel: '', dni: '' });

  const [productos, setProductos] = useState([]);
  const [esAdmin, setEsAdmin] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formAdmin, setFormAdmin] = useState({ titulo: '', descripcion: '', icono: '' });

  const [mostrandoLogin, setMostrandoLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [cargandoLogin, setCargandoLogin] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");

  // --- LOGICA DE CARGA Y SESION ---
  const fetchProductos = async () => {
    const { data, error } = await supabase.from('productos_seguros').select('*').order('created_at', { ascending: true });
    if (error) console.error("Error:", error);
    else setProductos(data || []);
  };

  useEffect(() => {
    fetchProductos();
    const authData = JSON.parse(localStorage.getItem('admin_session'));
    if (authData) {
      const ahora = new Date().getTime();
      if (ahora - authData.timestamp < 10 * 60 * 1000) setEsAdmin(true);
      else localStorage.removeItem('admin_session');
    }
  }, []);

  const verificarAcceso = async (e) => {
    e.preventDefault();
    setCargandoLogin(true);
    setErrorLogin("");
    try {
      const { data, error } = await supabase.from('config_admin').select('clave_admin').single();
      if (passwordInput === data.clave_admin) {
        localStorage.setItem('admin_session', JSON.stringify({ auth: true, timestamp: new Date().getTime() }));
        setEsAdmin(true);
        setMostrandoLogin(false);
        setPasswordInput("");
      } else {
        setErrorLogin("Contraseña incorrecta");
      }
    } catch (err) { setErrorLogin("Error de conexión"); }
    finally { setCargandoLogin(false); }
  };

  const cerrarSesion = () => { setEsAdmin(false); localStorage.removeItem('admin_session'); };

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (editandoId) await supabase.from('productos_seguros').update(formAdmin).eq('id', editandoId);
    else await supabase.from('productos_seguros').insert([formAdmin]);
    setFormAdmin({ titulo: '', descripcion: '', icono: '' });
    setEditandoId(null);
    fetchProductos();
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Eliminar seguro?")) {
      await supabase.from('productos_seguros').delete().eq('id', id);
      fetchProductos();
    }
  };

  const enviarWhatsApp = async (e) => {
    e.preventDefault();
    await supabase.from('prospectos').insert([{ 
      nombre: formData.nombre,
      dni: formData.dni,             // Asegúrate que en Supabase la columna sea 'dni' en minúsculas
      email: formData.email,
      telefono: formData.tel,        // Si en Supabase se llama 'tel', cambia 'telefono' por 'tel'
      fecha_nacimiento: formData.fechaNac, // Si en Supabase se llama 'fechaNac', cámbialo aquí
      producto: productoSeleccionado.titulo 
    }]);
    const msg = `Hola Andrea! Mi nombre es ${formData.nombre}. Me interesa consultar por *${productoSeleccionado.titulo}*.
Mis datos:
- Nacimiento: ${formData.fechaNac}
- DNI: ${formData.dni}
- Email: ${formData.email}
- Telefono: ${formData.tel}`;
    window.open(`https://api.whatsapp.com/send?phone=5492236825335&text=${encodeURIComponent(msg)}`, '_blank');
    setModalAbierto(false);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#FDF8F5] text-gray-900 font-sans relative">
      
      {/* PANTALLA LOGIN */}
      {mostrandoLogin && (
        <div className="fixed inset-0 bg-[#FDF8F5] z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm mx-auto mb-8 flex items-center justify-center border border-red-50 text-4xl">🔐</div>
            <h2 className="text-4xl font-bold mb-2">Administrador</h2>
            <p className="text-gray-500 mb-10 text-sm">Sesión activa por 10 min</p>
            <form onSubmit={verificarAcceso} className="space-y-4">
              <input autoFocus type="password" placeholder="Contraseña" className="w-full p-5 bg-white rounded-2xl border-2 outline-none text-center" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
              {errorLogin && <p className="text-red-500 font-bold">{errorLogin}</p>}
              <button type="submit" className="w-full bg-[#8B1A1A] text-white py-5 rounded-2xl font-bold">Entrar</button>
              <button type="button" onClick={() => setMostrandoLogin(false)} className="text-gray-400 mt-4">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* BOTON FLOTANTE ADMIN */}
      <button onClick={() => esAdmin ? cerrarSesion() : setMostrandoLogin(true)} className="fixed bottom-4 right-4 z-50 opacity-20 hover:opacity-100 bg-gray-400 text-white p-2 rounded text-[10px] font-bold">
        {esAdmin ? "SALIR PANEL" : "ADMIN"}
      </button>

      {esAdmin ? (
        <AdminPanel 
          productos={productos} 
          formAdmin={formAdmin} 
          setFormAdmin={setFormAdmin} 
          guardarProducto={guardarProducto} 
          eliminarProducto={eliminarProducto} 
          editandoId={editandoId} 
          setEditandoId={setEditandoId} 
          cerrarSesion={cerrarSesion} // <--- Agregar esta línea
        />
      ) : (
        <>
          {/* HEADER */}
          <header className="bg-[#FDF8F5] border-b sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/favicon_logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                <h1 className="text-xl font-bold">Andrea Verónica Soler</h1>
              </div>
              <nav className="hidden md:block text-red-800 font-bold text-sm tracking-widest uppercase">Productora Asesora de Seguros</nav>
            </div>
          </header>

          {/* PORTADA */}
          <section className="w-full bg-[#FDF8F5] py-10 flex justify-center px-4">
            <div className="max-w-5xl w-full relative">
              <div className="absolute -inset-2 border border-red-100 rounded-[50px] -z-10 hidden md:block"></div>
              <div className="relative h-[250px] md:h-[380px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                <img src="/portada.jpg" alt="Andrea Soler" className="w-full h-full object-cover object-[center_10%]" />
              </div>
            </div>
          </section>

          {/* GRILLA PRODUCTOS */}
          <main className="container mx-auto py-12 px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Nuestros Seguros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {productos.map((prod) => (
                <div key={prod.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all">
                  <span className="text-5xl mb-4">{prod.icono}</span>
                  <h3 className="text-xl font-bold mb-3">{prod.titulo}</h3>
                  <p className="text-gray-600 mb-6 flex-grow text-sm">{prod.descripcion}</p>
                  <button onClick={() => { setProductoSeleccionado(prod); setModalAbierto(true); }} className="bg-[#8B1A1A] text-white font-bold py-3 rounded-xl hover:bg-red-900 transition">
                    Cotizar ahora
                  </button>
                </div>
              ))}
            </div>
          </main>

          {/* FOOTER RESTAURADO */}
          <footer className="container mx-auto px-4 pb-20">
            <div className="max-w-5xl mx-auto bg-white border border-red-100 rounded-[50px] p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center gap-12">
              <div className="flex-shrink-0">
                <img src="/favicon_logo.png" alt="Logo" className="w-32 h-32 md:w-44 md:h-44 object-contain" />
              </div>
              <div className="flex-grow w-full">
                <h2 className="text-3xl font-bold text-[#8B1A1A] mb-8">Contactanos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[#8B1A1A] font-bold mb-1 uppercase text-[10px] tracking-widest">📍 Dirección</h4>
                      <p className="text-gray-700 font-medium">Av. Constitución 4635, Mar del Plata</p>
                    </div>
                    <div>
                      <h4 className="text-[#8B1A1A] font-bold mb-1 uppercase text-[10px] tracking-widest">✉️ Email</h4>
                      <p className="text-gray-700 font-medium break-all text-sm">andreaveronicasoler@gmail.com</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[#8B1A1A] font-bold mb-1 uppercase text-[10px] tracking-widest">📞 Celulares</h4>
                      <p className="text-gray-700 font-medium">+54 9 2236825335 | +54 9 2234711123</p>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <a href="https://www.facebook.com/andreaveronicasoler" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-red-50 transition-colors">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-5" alt="Facebook" />
                      </a>
                      <a href="https://www.instagram.com/soler_andrea_seguros/" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-red-50 transition-colors">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="w-5" alt="Instagram" />
                      </a>
                      <a href="https://www.linkedin.com/in/andrea-veronica-soler-0966822a/" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-red-50 transition-colors">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" className="w-5" alt="LinkedIn" />
                      </a>
                      <a href="https://api.whatsapp.com/send?phone=5492236825335&text=Hola%20Andrea!%20Me%20interesa%20cotizar%20un%20seguro." target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-red-50 transition-colors"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5" alt="WhatsApp" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center mt-10 text-gray-400 text-[10px] uppercase tracking-widest italic">© {new Date().getFullYear()} Andrea Verónica Soler • Productora Asesora de Seguros</p>
          </footer>
        </>
      )}

      {/* MODAL COTIZACIÓN */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Cotizar {productoSeleccionado?.titulo}</h3>
            <form onSubmit={enviarWhatsApp} className="space-y-4">
              <input required placeholder="Nombre" className="w-full p-3 bg-[#FDF8F5] rounded-xl border outline-none" onChange={e => setFormData({...formData, nombre: e.target.value})} />
              <div className="flex gap-4">
                <input 
                  required 
                  type="date" 
                  className="w-full p-3 bg-[#FDF8F5] rounded-xl border outline-none focus:border-[#8B1A1A]" 
                  onChange={e => setFormData({...formData, fechaNac: e.target.value})} 
                />
                <input 
                  required 
                  type="text" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="DNI" 
                  className="w-full p-3 bg-[#FDF8F5] rounded-xl border outline-none focus:border-[#8B1A1A]" 
                  value={formData.dni}
                  onChange={e => {
                    // Filtramos para que solo acepte números
                    const soloNumeros = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, dni: soloNumeros});
                  }} 
                />
              </div>
              <input required type="email" placeholder="Email" className="w-full p-3 bg-[#FDF8F5] rounded-xl border" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="tel" placeholder="Telefono" className="w-full p-3 bg-[#FDF8F5] rounded-xl border" onChange={e => setFormData({...formData, tel: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalAbierto(false)} className="flex-1 py-3 text-gray-500 font-bold rounded-xl hover:bg-gray-100 hover:text-gray-700 transition-all duration-200">Cancelar</button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#25D366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1eb957] hover:shadow-lg transition-all duration-200"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                    alt="WhatsApp" 
                    className="w-5 h-5 brightness-0 invert" 
                  />
                  Enviar
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