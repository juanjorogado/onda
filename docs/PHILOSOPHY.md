# Filosofía de Onda

Onda es una app de radio para iPhone. Pero más concretamente: es una app de radio para escuchar mientras conduces. Esa distinción lo define todo.

---

## Conducción primero

La interfaz se diseña para el peor contexto de atención posible: un vistazo de medio segundo a 120 km/h.

Cada elemento que no informa en ese vistazo es un elemento de más. No hay menús, no hay opciones, no hay configuración visible. Solo lo que suena, dónde suena y cuándo es allí.

Esto no es una limitación — es la decisión de diseño más importante de la app. La simplicidad no es el resultado de no haber añadido cosas. Es el resultado de haberlas eliminado.

---

## Los principios de Rams

Onda toma los [diez principios de buen diseño de Dieter Rams](https://www.vitsoe.com/us/about/good-design) no como inspiración sino como criterio de aceptación. Antes de añadir cualquier elemento, la pregunta es: ¿lo eliminaría Rams?

Los más relevantes para esta app:

**El buen diseño es discreto.**
Los productos que cumplen un propósito son herramientas. No son obras de arte decorativas ni objetos de exhibición. Su diseño debe ser neutro y contenido, dejando espacio para la expresión del usuario. Aquí: la música.

**El buen diseño es honesto.**
No hace que un producto parezca más innovador, potente o valioso de lo que realmente es. No manipula al usuario con promesas que no puede cumplir.

**El buen diseño es tan poco diseño como sea posible.**
Menos, pero mejor. Se concentra en los aspectos esenciales y los productos no se sobrecargan con lo no esencial. De vuelta a la pureza, de vuelta a la simplicidad.

---

## Open source con criterio

Onda es open source. Eso significa que cualquiera puede leer el código, entender las decisiones y contribuir.

Pero abierto no significa caótico. El código es legible porque el diseño es legible. Algunos principios que lo hacen posible:

- **Los Design Tokens son la única fuente de verdad.** Ningún color, espaciado, tipografía o radio se escribe a mano en el código. Si un valor de diseño no tiene token, se propone antes de implementarlo.
- **Las decisiones están documentadas donde importa.** No en comentarios inline, sino en los sitios donde se toman: los archivos de arquitectura, las reglas del squad, este documento.
- **La arquitectura refleja la interfaz.** Simple, directa, sin capas innecesarias. Quien entienda la app puede entender el código.

---

## El código también es diseño

La belleza de Onda no termina en la pantalla. El código y la organización de archivos siguen los mismos principios que la interfaz.

Un archivo bien estructurado, un componente con una sola responsabilidad, un token con el nombre exacto — son decisiones de diseño. No hay distinción entre "el código que ve el usuario" y "el código que no ve nadie". Todo el código es visible: es open source.

Esto significa en la práctica:

- **Nombrar con precisión.** Un token, una clase, una función — su nombre comunica su propósito sin necesitar comentario.
- **Una responsabilidad por pieza.** Los componentes hacen una cosa. Los hooks encapsulan una lógica. Los archivos CSS tienen un alcance claro.
- **Sin capas innecesarias.** La arquitectura más simple que resuelve el problema real. Añadir abstracción antes de necesitarla es deuda disfrazada de elegancia.
- **Los tokens como vocabulario compartido.** El sistema de diseño y el código hablan el mismo idioma. Un cambio en un token se propaga con coherencia, no con sorpresas.

> "Good design is thorough down to the last detail." — Dieter Rams

---

## Lo que Onda no es

A veces la filosofía se define mejor por exclusión:

- No es una app de descubrimiento. No recomienda, no sugiere, no aprende.
- No es una app social. No hay perfiles, no hay favoritos, no hay historial.
- No es una app de configuración. No hay ajustes que el usuario deba tomar.
- No compite con la música. La interfaz desaparece cuando suena algo.
