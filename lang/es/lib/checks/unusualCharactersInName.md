{{#preferred}}
Esta persona tiene los siguientes caracteres inusuales en su nombre: {{chars}}.
{{#brackets}}
Estos caracteres se utilizan a menudo para anotar un nombre o apellido alternativo, pero esto se hace mejor añadiendo un nombre alternativo.
Elimine las anotaciones alternativas desde el nombre preferido y añádalas como nombres alternativos.
{{/brackets}}
{{^brackets}}      
Estos caracteres no se encuentran normalmente en los nombres. Actualice el nombre de la persona en el [árbol de familia](https://familysearch.org/tree/person/{{pid}}/details) para eliminar los caracteres inusuales.
{{/brackets}}
{{/preferred}}
{{^preferred}}
Estos nombres alternativos tienen caracteres que normalmente no aparecen en los nombres:

{{#badNames}}
* {{.}}
{{/badNames}}

Actualice estos nombres en el [árbol de familia](https://familysearch.org/tree/person/{{pid}}/details) para eliminar los caracteres inusuales.
{{/preferred}}