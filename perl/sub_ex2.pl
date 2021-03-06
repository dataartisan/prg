#!/local/app/bin/perl -w

# demonstrates how "wantarray()" may be used

# Context-sensitive searching:
#  scalar:
#    search for first occurrence of substring and return offset
#  list:
#    search for occurrence of substring in incoming list and return matched strings

sub search {
    my $substr = shift;
    if (wantarray()) {
	# remaining parameters are values being searched
	my @values = @_;
	my @retval = ();
	foreach (@values) {
	    my $index = index($_, $substr);
	    push @retval, (($index >= 0) ? $_ : ());
	}
	return @retval;
    } else {
	# search in incoming scalar string
	my $value = shift;
	my $index = index($value, $substr);
	return ($index > 0) ? $index : undef;
    }
}

my @items = ('systematic', 'system');
my $scalar = 'delinquency';

my $search1 = search('que', $scalar);
print "'que' ", $search1?'':'not ', "found in $scalar\n";

my @search2 = search ('sys', @items);
$" = "\n";

print "'sys' found in the following items:\n@search2\n";
