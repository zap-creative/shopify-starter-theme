export const tFilterReplace = (str, substitutions, entities = false) => {
  let source, replace;
  for (const token in substitutions) {
    replace = substitutions[token];
    if(typeof str === 'object' && typeof replace === 'number') {
      switch (replace) {
        case 0:
          source = str.zero || Object.values(str)[0];
          str = source.replaceAll(`{{${token}}}`, replace);
          break;
          
        case 1:
          source = str.one || Object.values(str)[0];
          str = source.replaceAll(`{{${token}}}`, replace);
          break;

        case 2:
          source = str.two || str.few || Object.values(str)[0];
          str = source.replaceAll(`{{${token}}}`, replace);
          break;

        case 3:
        case 4:
          source = str.few || str.many || str.other || Object.values(str)[0];
          str = source.replaceAll(`{{${token}}}`, replace);
          break;
          
        default:
          source = str.many || str.other || Object.values(str)[0];
          str = source.replaceAll(`{{${token}}}`, replace);
          break;  
      }
    } else if(typeof str === 'string') {
      str = str.replaceAll(`{{${token}}}`, replace);
    } 
  }

  if (entities) {
    return str.replaceAll('\\u0026', '&');
  }

  return str;
};