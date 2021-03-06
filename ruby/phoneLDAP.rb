require 'ldap'
name = ARGV.shift or raise "No user specified"
host = 'LDAP.ca.alcatel.com' # host name of the ldap server
port = 389

# NOTE! The order of the values in your BASE string is important!
base = 'o=Alcatel'

conn = LDAP::Conn.new(host, port)
conn.set_option( LDAP::LDAP_OPT_PROTOCOL_VERSION, 3 )
conn.bind("o=Alcatel", "")

search_string = '(cn=*' + name + '*)'
# Now lests try a query!
results = conn.search2(base, LDAP::LDAP_SCOPE_SUBTREE, search_string)


print "\n"
results.each{|m|
	print m["cn"], ": "
	print m["mail"], ": " 
	print m["telephoneNumber"],"\n"}

