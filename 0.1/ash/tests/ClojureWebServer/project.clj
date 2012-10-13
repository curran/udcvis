(defproject hello-www "1.0.0-SNAPSHOT"
  :description "A Compojure 'Hello World' application"
  :dependencies [[org.clojure/clojure "1.2.0"]
                 [org.clojure/clojure-contrib "1.2.0"]
                 [compojure "0.6.4"]]
  :dev-dependencies [[lein-ring "0.4.5"]]
  :ring {:handler hello-www.core/app})