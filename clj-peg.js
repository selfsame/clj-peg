{
  function token(tag, value){
    return {tag:tag, value:value};
  }

  function notnull(x){return x != null;}
}


Start = Form+

Form = _ seq:(Collection / Atom) {return seq}
Collection = List / Vector / Map / Set / Lambda


List = "(" _ seq:Form* ")" _ { return token("list", seq);}
Vector = "[" _ seq:Form* "]" _ { return token("vector", seq);}
Map = "{" _ seq:Pair* "}" _ { return token("map", seq);}
Set = "#{" _ seq:Form* "}" _ { return token("set", seq);}
Lambda = "#(" _ seq:Form* ")" _ { return token("lambda", seq);}

Pair = k:Form v:Form {return [k, v]}



Atom = 
  String / Char / Number /
  NSSymbol / Symbol / 
  QualifiedKeyword / Keyword / 
  Special / Comment 



Special = Ignore / Quote / Backtick / Tilde / Deref / TaggedLiteral / VarQuote / Meta

Quote = "'" val:Form _ {return token("quote", val)}
Backtick = "`" val:Form _ {return token("backtick", val)}
Tilde = "~" val:Form _ {return token("tilde", val)}
Deref = "@" val:Form _ {return token("deref", val)}
Variadic = "&" _ val:(NSSymbol / Symbol) _ {return token("variadic", val)}
VarQuote = "#'" val:Form _ {return token("var-quote", val)}
TaggedLiteral = "#" tag:Symbol _ val:Form _ {return token("#" + tag.value, val)}
Meta = "^" v:(Keyword / Map / NSSymbol / Symbol) _ {return token("meta", v)}
Ignore = "#_" _ val:Form _ {return token("ignore", val)}


Keyword  = ":" val:Symbol _ {return token("keyword", val.value)}

QualifiedKeyword  = "::" val:Symbol _ {return token("qualified-keyword", val.value)}



String = "\"" str:("\\\"" / [^\"]  )* "\"" _ {return token("string", str.join(""))}

Comment = ";" str:[^\n\r]* _ {return token("comment", str.join(""))}

NSSymbol =
 ns:Symbol "\/" sym:Symbol _ {return {"tag":"ns-symbol", "ns":ns.value, "value":sym.value}}

Symbol
  = first:Character rest:(Character/NonLeading)* _ {return token("symbol", first + rest.join(""))}

Char = "\\" char:[^ \t\n\r] _ {return token("char", char)}



Number = Ratio / Float / Integer

Ratio = f:Integer "/" l:Integer {return token("ratio", [f.value, l.value])}
Float = first:[0-9]+ "." rest:[0-9]+ _ { return token("float", parseFloat(text(), 10)); }
Integer = first:[0-9]rest:[0-9]* _ { return token("int", parseInt(text(), 10)); }


__ "whitespace" = [ \t\n\r]+ {return null;}

_ "whitespace" = [ \t\n\r]* {return null;}


NonLeading  = [0-9\#\%\'\:]

Character = [^\(\)\[\]\{\}\;\^\~\`\'\"\@\ \n\r\t\:\/\#\\]
