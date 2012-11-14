// A Peg.js parser definition for the RDF Turtle syntax.
// Ported from http://www.w3.org/TeamSubmission/turtle/#statement
// by Curran Kelleher
// November 2012
//
// TODO test using examples at 
//   http://www.w3.org/TeamSubmission/turtle/tests/

start = turtleDoc

turtleDoc = statements

statements = head:statement tail:(statement)* {
      var result = head, i, j, stmts;
      for (i = 0; i < tail.length; i++) {
        stmts = tail[i];
        for (j = 0; j < stmts.length; j++) {
          result.push(stmts[j]);
        }
      }
      return result;
    }

statement = directive:directive _ '.' _ {return [directive];}
          / triples:triples _ '.' _ {return triples;}

directive = prefixID

prefixID = '@prefix' _ prefixName:prefixName ':' _ uriref:uriref {
      return {
        type: 'prefix',
        prefixName: prefixName,
        uriref: uriref
      };
    }

prefixName = name
name = chars:nameChar+ { return chars.join(""); }
nameChar = '-' / '_' / [0-9] / [a-z] / [A-Z]

uriref = '<' relativeURI:relativeURI '>' { 
      return {
        type: 'uri',
        uri: relativeURI
      }
    }
relativeURI = chars:ucharacter* { return chars.join(""); }
ucharacter = [^>]

triples = subject:subject _ predicateObjectList :predicateObjectList {
      var list = [], 
          n = predicateObjectList.length,
          predicateObject;
      for(var i = 0; i < n; i++){
        predicateObject = predicateObjectList[i];
        list.push({
          type: "triple",
          subject: subject, 
          predicate: predicateObject.verb,
          object: predicateObject.objectList
        });
      }
      return list;
    }
subject = resource
resource = uriref / qname

qname = prefixName:prefixName? ':' name:name? {
      return {
        type: 'qName',
        prefix: prefixName,
        name: name
      };
    }

predicateObjectList = 
  verbHead:verb _ objectListHead:objectList _ 
  tail:(';' _ verb _ objectList)* {
      var list = [{ 
        verb:verbHead, 
        objectList:objectListHead
      }];
      for(var i = 0; i < tail.length; i++){
        list.push({ 
          verb:tail[i][2],
          objectList:tail[i][4]
        });
      }
      return list;
    }
verb = predicate:predicate {
      if(predicate === 'a')
        return {
          type: 'qName',
          prefix: 'rdf',
          name: 'type'
        };
      else
        return predicate;
    }
predicate = resource / 'a'

objectList = object
object = resource / literal

literal = literalValue:literalValue {
      return {
        type: 'literal',
        value: literalValue
      };
    }

literalValue = quotedString
  / quotedString ( '@' language )? 
  / datatypeString / number / boolean
datatypeString = quotedString '^^' resource
boolean = 'true' / 'false'
language = name
quotedString = '"' '"' _ { return ""; }
    / '"' chars:chars '"' _ { return chars; }
chars
  = chars:char+ { return chars.join(""); }
char = [^"]

// number code from 
// https://github.com/dmajda/pegjs/blob/master/examples/json.pegjs

number "number"
  = int_:int frac:frac exp:exp _ { return parseFloat(int_ + frac + exp); }
  / int_:int frac:frac _         { return parseFloat(int_ + frac);       }
  / int_:int exp:exp _           { return parseFloat(int_ + exp);        }
  / int_:int _                   { return parseFloat(int_);              }

int
  = digit19:digit19 digits:digits     { return digit19 + digits;       }
  / digit:digit
  / "-" digit19:digit19 digits:digits { return "-" + digit19 + digits; }
  / "-" digit:digit                   { return "-" + digit;            }

frac
  = "." digits:digits { return "." + digits; }

exp
  = e:e digits:digits { return e + digits; }

digits
  = digits:digit+ { return digits.join(""); }

e
  = e:[eE] sign:[+-]? { return e + sign; }

digit
  = [0-9]

digit19
  = [1-9]

hexDigit
  = [0-9a-fA-F]

_ "whitespace"
  = whitespace*

whitespace
  = [ \t\n\r]
