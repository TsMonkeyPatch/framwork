# @tsmonkeypatch/core/datalist

Works like @angular/cdk/scroll but only shows a list of items which can be navigated by keyboard or mousewheel and no scrollbars.

## Motivation

@angular/cdk/scroll has one big problem in my opinion this are very large datasets, since this one is working with arrays this will be as big as the number of items we expect to recieve. This is okay for datasets of 10k or maybe 100k items but if we go forward and expect datasets which could have Millions of entries we get a huge problem.

@Example

```ts
/** 
 * 10 million entries there could be more in big data
 * memory usage of chrome grows up to 2.4gb and got the
 * message "he is dead jim"
 * 
 * anyway if we not add the map, the browser will stay alive
 * but there is allways an array in the background of the scroll
 * which will be filled up and this one will have 10.000.000 entries
 * 
 */
Array.from({length: 10000000}).map((value, index) => index);
```

A big pro is they use the scrollbars of the browser se they dont need a scrollbar library (customizing is not a problem which can be solved by css), but to make this possible they add a container after the list which simply gets a specific height like 40px height per item multiplied with the total amount of items. 

- 10k items * 40px = 400.000px (easy)
- 100k items * 40px = 4.000.000px (easy)
- 10M items * 40px = 400.000.000px (okay at this point we become some serious trouble, if the array creation not crashed the browser allready).

So @angular/cdk/scrolling is perfectly fine with datasets which have 10k items at least 100k is also okay so this could be used, we just want to resolve the issue that we can have really big data. 
