$(document).ready(function () {
  //Form open close
  $(".open-btn").click(function () {
    event.preventDefault();
    $(".login").addClass("hidden");
    $(".register").removeClass("hidden");
  });

  $(".close-btn").click(function () {
    event.preventDefault();
    $(".login").removeClass("hidden");
    $(".register").addClass("hidden");
  });
});
