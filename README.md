# Proyecto de Rango Personalizado

Este proyecto implementa un control deslizante (slider) con un rango personalizado, donde los valores mínimo y máximo pueden ser definidos de forma dinámica o a partir de un conjunto de valores fijos. Este control deslizante es útil en situaciones donde se necesita elegir un rango específico de valores, como en aplicaciones e-commerce, de precios o ajustes de configuraciones.

## Estructura del Proyecto

El proyecto está estructurado en componentes reutilizables y usa **React** para la interfaz de usuario y **Next.js** para la gestión de rutas. Utiliza **TypeScript** para mejorar la seguridad y la legibilidad del código.

### Funcionalidades

1. **Rango Dinámico**: El rango mínimo y máximo se puede obtener de una API simulada y se actualiza en el slider.
2. **Rango con Valores Fijos**: El control deslizante permite restringir los valores a una lista de valores fijos, como en un conjunto de precios específicos.
3. **Interactividad**: Los usuarios pueden interactuar con el control deslizante, y los valores se actualizan en tiempo real.
4. **Accesibilidad**: El componente de control deslizante está optimizado con atributos de accesibilidad para ser utilizado por personas con discapacidades.
5. **Mocks**: Simulan la obtención de datos de una API, proporcionando un conjunto de valores para el rango normal y una lista de valores fijos .
6. **Testing**: Se realizaron pruebas unitarias y de integración para garantizar que todos los componentes interactúan correctamente entre sí. 

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/sandratondo/test_mango
