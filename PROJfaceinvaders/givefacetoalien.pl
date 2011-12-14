use Image::Magick;

$filename = "example4";

$x = Image::Magick->new;
$x->Read("alien12_50x50.bmp");
$x->Read($filename.".jpg");

$x->[0]->Composite(
	 image => $x->[1],
	 compose => "Minus"
	 );

$x->[0]->Scale(geometry => "100%x72%");

$x->[0]->Write("png:".$filename.".png");


