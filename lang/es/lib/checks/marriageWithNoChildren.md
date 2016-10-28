{{^multipleSpouses}}
El matrimonio entre [{{name}}](https://familysearch.org/tree/person/{{pid}}/details)
y [{{spouse.name}}](https://familysearch.org/tree/#view=ancestor&person={{spouse.id}}) no tiene hijos. Aunque esto es posible aún representa una oportunidad para la investigación hasta que esté seguro de que la pareja no tuvo hijos.
{{/multipleSpouses}}
{{#multipleSpouses}}
[{{name}}](https://familysearch.org/tree/person/{{pid}}/details) tiene múltiples matrimonios sin hijos. Aunque esto es posible todavía representa una oportunidad para la investigación
hasta que esté seguro de que las parejas no tuvieron hijos.

{{#spouses}}
* [{{name}}](https://familysearch.org/tree/person/{{id}}/details)
{{/spouses}}
{{/multipleSpouses}}