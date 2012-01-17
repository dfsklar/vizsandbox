# THE FULL RUBY VERSION OF THIS SCRIPT SHOULD BEHAVE AS FOLLOWS:
#   INPUT (URL query params):
#       ID of the facebook user
#       which mask to use (1 or 2)
#   OUTPUT:
#      should emit as its response the constructed PNG image


# RUBY HAS AN Image::Magick GEM EQUIVALENT:
use Image::Magick;

# INIT:
$x = Image::Magick->new;


#URL of the incoming facebook profile pic (50x50)
# This is hardwired to Graham Ross' profile pic, but should
# become a random(?) selection from the friends of the
# facebook user identified by a URL query param.
$filename = "http://profile.ak.fbcdn.net/hprofile-ak-snc4/211751_676512928_854384475_q.jpg"; #example4";



# There are two masks:
#  alienmask1_50x50.bmp
#  alienmask2_50x50.bmp
# A URL query param should allow the caller to specify which mask is desired.
# In this demo, I'm hardwiring to just one of these masks:
$x->Read("alienmask1_50x50.bmp");

# Now we read the facebook profile pic via the URL:
$x->Read($filename);

# MERGE:
$x->[0]->Composite(
	 image => $x->[1],
	 compose => "Minus"
	 );

# SCALE to reduce the height to restore the orig aspect ratio
$x->[0]->Scale(geometry => "100%x72%");

# WE'RE DONE!  Ready to emit...

# In this prototype, I'm writing the result out to a file.
# But this really needs to be *serving* the image, with the appropriate mime type
$OUTfilenamebase = "fromurl";
$x->[0]->Write("png:".$OUTfilenamebase.".png");
