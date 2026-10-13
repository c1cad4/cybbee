import unittest,tempfile,os,sys
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from community import Community
class CommunityTests(unittest.TestCase):
 def test_publication_requires_enable_and_consent_and_coarsens_coordinates(self):
  with tempfile.TemporaryDirectory() as folder:
   c=Community(folder+'/community.db');self.assertEqual(c.posts()['posts'],[])
   with patch.dict(os.environ,{'CYBBEE_COMMUNITY_ENABLED':'0'}):
    with self.assertRaises(ValueError):c.add_point({'lat':43,'lon':131,'consent':True})
   with patch.dict(os.environ,{'CYBBEE_COMMUNITY_ENABLED':'1'}):
    result=c.add_point({'lat':43.123456,'lon':131.912345,'consent':True});self.assertEqual(result['points'][0]['lat'],43.1);self.assertEqual(result['points'][0]['lon'],131.9)
    with self.assertRaises(ValueError):c.add_point({'lat':float('nan'),'lon':10,'consent':True})
    with self.assertRaises(ValueError):c.add_post({'author':'A','text':'Text','kind':'chat'})
    self.assertEqual(c.add_post({'author':'A','text':'Text','kind':'chat','consent':'on'})['posts'][0]['text'],'Text')
