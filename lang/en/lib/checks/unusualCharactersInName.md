{{preferred}}
This person has the following unusual characters in their name: {{chars}}.
{{#brackets}}
These characters are often used to annotate an alternate given name or surname, but this is better done by adding an alternate name.
Remove the alternate annotations from the preferred name and add them as alternate names.
{{/brackets}}
{{^brackets}}      
These characters are not normally found in names. Update the person's name in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}) to remove the unusual characters.
{{/brackets}}
{{/preferred}}
{{^preferred}}
These alternate names have characters which normally do not appear in names:

{{#badNames}}
* {{.}}
{{/badNames}}

Update these names in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}) to remove the unusual characters.
{{/preferred}}