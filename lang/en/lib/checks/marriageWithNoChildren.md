{{^multipleSpouses}}
The marriage between [{{name}}](https://familysearch.org/tree/person/{{pid}}/details)
and [{{spouse.name}}](https://familysearch.org/tree/person/{{spouse.id}}/details) has no children. Though this is possible it still represents
an opportunity for research until you are confident that the couple had no children.
{{/multipleSpouses}}
{{#multipleSpouses}}
[{{name}}](https://familysearch.org/tree/person/{{pid}}/details) has multiple marriages
with no children. Though this is possible it still represents an opportunity for research 
until you are confident that the couples had no children.

{{#spouses}}
* [{{name}}](https://familysearch.org/tree/person/{{id}}/details)
{{/spouses}}
{{/multipleSpouses}}