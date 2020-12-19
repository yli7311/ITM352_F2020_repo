var month = " ";
var num_days = 0;

switch (month) {
    case Janurary || March || May || July || August || October || December:
        var num_days = 31;
    break;
    case Feburary:
        var num_days = 28;
    break;
    case April || June || September || November:
        var num_days = 30;
    break;
    default:
        var month = "-1";
        System.out.println("Error");
    break;
}
