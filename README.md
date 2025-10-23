# PokéDex App 🎮

Una aplicación web moderna para explorar y descubrir información detallada sobre Pokémon. Construida con las últimas tecnologías web para ofrecer una experiencia de usuario fluida y responsiva.

## 🌟 Características

- **Exploración de Pokémon**: Navega por una extensa colección de Pokémon
- **Búsqueda inteligente**: Encuentra rápidamente tu Pokémon favorito
- **Detalles completos**: Información detallada de cada Pokémon incluyendo estadísticas, tipos y habilidades
- **Paginación eficiente**: Navegación optimizada a través de grandes listas
- **Ordenamiento flexible**: Organiza los Pokémon según diferentes criterios
- **Imágenes optimizadas**: Carga lazy de imágenes para mejor rendimiento
- **Diseño responsivo**: Perfectamente adaptado para desktop y móvil
- **Interfaz moderna**: UI limpia y atractiva con animaciones suaves

## 🚀 Demo en Vivo

La aplicación está desplegada y disponible en: **[https://pokemon-hub-andres-otalvaro.vercel.app](https://pokemon-hub-andres-otalvaro.vercel.app)**

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI con los últimos hooks y características
- **TypeScript** - Tipado estático para mayor robustez y mantenibilidad
- **Vite** - Herramienta de build rápida y moderna
- **CSS Modules/Styled Components** - Estilos componentizados y escalables

### Herramientas de Desarrollo
- **ESLint** - Linting de código para mantener consistencia
- **Qodo** - Agentes y workflows para automatización
- **Git** - Control de versiones

### Despliegue
- **Vercel** - Plataforma de despliegue con CI/CD automático
- **GitHub** - Repositorio y colaboración

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── CardsPokemon.tsx    # Tarjetas de Pokémon
│   ├── HeaderPokemon.tsx   # Cabecera de la aplicación
│   ├── LazyImage.tsx       # Componente de imagen con lazy loading
│   ├── Pagination.tsx      # Navegación por páginas
│   ├── PokemonDetail.tsx   # Vista detallada del Pokémon
│   ├── SearchIcon.tsx      # Icono de búsqueda
│   ├── SkeletonCard.tsx    # Loading skeleton
│   ├── SortMenu.tsx        # Menú de ordenamiento
│   ├── ValidationPopup.tsx # Popup de validación
│   ├── hooks/              # Custom hooks
│   ├── models/             # Tipos e interfaces
│   └── styles/             # Estilos de componentes
├── constants/           # Constantes de la aplicación
├── context/            # Context providers de React
├── hooks/              # Custom hooks globales
├── models/             # Modelos de datos TypeScript
├── pages/              # Páginas/vistas principales
├── styles/             # Estilos globales
├── test/               # Archivos de pruebas
├── utils/              # Utilidades y helpers
└── assets/             # Recursos estáticos
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18.0 o superior
- npm o yarn

### Pasos para ejecutar localmente

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/aotalvaros/pokemonHub_AndresOtalvaro.git
   cd pokedex-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter de código

## 🏗️ Arquitectura

La aplicación sigue una arquitectura moderna de React con:

- **Componentes funcionales** con hooks
- **Context API** para manejo de estado global
- **Custom hooks** para lógica reutilizable
- **TypeScript** para tipado fuerte
- **Lazy loading** para optimización de rendimiento
- **Responsive design** para todas las pantallas

## 🌐 API

La aplicación consume datos de la [PokéAPI](https://pokeapi.co/), una API REST gratuita que proporciona información completa sobre Pokémon.

## 📱 Características Responsivas

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si quieres contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Andres Otalvaro Sanchez** - [GitHub](https://github.com/aotalvaros) - [LinkedIn](https://www.linkedin.com/in/andres-otalvaro-sanchez-31274b214/)

## 🙏 Agradecimientos

- [PokéAPI](https://pokeapi.co/) por proporcionar los datos de Pokémon
- [Vercel](https://vercel.com/) por el hosting gratuito
- La comunidad de React por las increíbles herramientas

---