import React, { useState } from 'react';
import './FormularioML.css';

const FormularioML = () => {
  // Estado para los valores de los campos del formulario
  const [año, setAño] = useState('');
  const [mes, setMes] = useState('');
  const [dia, setDia] = useState('');
  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [indiceHenryHub, setIndiceHenryHub] = useState('');

  // Manejador para el cambio de valores en los campos del formulario
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'año':
        setAño(value);
        break;
      case 'mes':
        setMes(value);
        break;
      case 'dia':
        setDia(value);
        break;
      case 'estado':
        setEstado(value);
        break;
      case 'municipio':
        setMunicipio(value);
        break;
      case 'indiceHenryHub':
        setIndiceHenryHub(value);
        break;
      default:
        break;
    }
  };

  // Manejador para el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    // Aquí se realizaría la lógica para enviar los valores del formulario al modelo de machine learning

    // Reiniciar los campos del formulario
    setAño('');
    setMes('');
    setDia('');
    setEstado('');
    setMunicipio('');
    setIndiceHenryHub('');
  };

  return (
    <div className="formulario-container">
      {/* Título del formulario */}
      <h2 className="formulario-titulo">Predicción del precio márginal Local PML</h2>

      {/* Separador */}
      <div className="formulario-separador" />

      {/* Contenido del formulario */}
      <div className="formulario-content">
        <form className="formulario" onSubmit={handleSubmit}>
          {/* Campos del formulario */}
          <label>
            Año:
            <input type="text" name="año" value={año} onChange={handleInputChange} />
          </label>
          <label>
            Mes:
            <input type="text" name="mes" value={mes} onChange={handleInputChange} />
          </label>
          <label>
            Día:
            <input type="text" name="dia" value={dia} onChange={handleInputChange} />
          </label>
          <label>
            Estado:
            <input type="text" name="estado" value={estado} onChange={handleInputChange} />
          </label>
          <label>
            Municipio:
            <input type="text" name="municipio" value={municipio} onChange={handleInputChange} />
          </label>
          <label>
            Índice Henry Hub:
            <input type="text" name="indiceHenryHub" value={indiceHenryHub} onChange={handleInputChange} />
          </label>

          {/* Botón de envío */}
          <button type="submit">Predecir</button>
        </form>

        {/* Resultado de la predicción */}
        {/* En esta sección se mostraría la predicción del modelo de machine learning */}
        
      </div>
    </div>
  );
};

export default FormularioML;
