import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response"
export class FeatureView {
  type= HtmlButtonResponsePlugin
  stimulus="Zu welcher Kategorie gehört die Form in der Mitte?"
  prompt= "<p>To which type does the form in the middle belong?</p>"
  choices= ['Kategorie A', 'Kategorie B']  
  constructor(featureText, images){
    this.stimulus = `<table border="1" style="width: 91vw;">
    <colgroup>
        <col style="width: 20vw">
        <col style="width: 50vw">
        <col style="width: 20vw">
    </colgroup>
    <tr>
      <td><img src="`+images[0]+`"></td>
      <td style="text-align: center;" rowspan="2">`+featureText+`</td>
      <td><img src="`+images[1]+`"></td>
    </tr>
    <tr>
      <td><img src="`+images[2]+`"></td>
      <td><img src="`+images[3]+`"></td>
    </tr>
    <tr>
    <td></td>
    <td><img src="`+images[4]+`"></td>
    <td></td>
    </tr>
    </table>`
  }
};